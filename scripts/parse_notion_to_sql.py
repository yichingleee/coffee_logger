import re
import json

SOURCE_FILE = 'NotionExport/Coffee_Tasting.md'
OUTPUT_FILE = 'supabase/seed_notion_beans.sql'

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    beans = []
    current_country = "Unknown"
    current_bean = None

    # Regex patterns
    h1_pattern = re.compile(r'^#\s+(.*)')
    h3_pattern = re.compile(r'^###\s+(.*)')
    roaster_pattern = re.compile(r'(?i),?\s*roasted by\s*:?\s*(.*)')
    
    # Process keywords to identify
    process_keywords = [
        "Washed", "Natural", "Honey", "Anaerobic", "Maceration", 
        "Wet Hull", "Giling Basah", "Hybrid", "F1", "Double Fermentation",
        "Carbonic", "Yabai", "JH Natural", "Cold Fermentation", "Dark Room"
    ]

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1

        if not line:
            continue

        # Country Header
        h1_match = h1_pattern.match(line)
        if h1_match:
            raw_country = h1_match.group(1).strip()
            # Clean "Coffee" from "Ethiopian Coffee" -> Ethiopia
            if "Ethiopian" in raw_country: current_country = "Ethiopia"
            elif "Kenya" in raw_country: current_country = "Kenya"
            elif "Burundi" in raw_country: current_country = "Burundi"
            elif "Tanzania" in raw_country: current_country = "Tanzania"
            elif "Rwanda" in raw_country: current_country = "Rwanda"
            elif "Costa Rica" in raw_country: current_country = "Costa Rica"
            elif "Colombia" in raw_country: current_country = "Colombia"
            else: current_country = raw_country.replace(" Coffee", "")
            continue
        
        # Bean Header (H3)
        h3_match = h3_pattern.match(line)
        if h3_match:
            # If we were processing a bean, verify if it's done? 
            # (Implicitly done when new one starts)
            
            bean_name = h3_match.group(1).strip()
            # Remove markdown bolding if present
            bean_name = bean_name.replace('**', '')

            # Parse Metadata (Next non-empty line)
            metadata_line = ""
            while i < len(lines):
                next_line = lines[i].strip()
                if next_line and not next_line.startswith('!'): # skip images immediately
                    metadata_line = next_line
                    i += 1
                    break
                elif next_line and next_line.startswith('!'):
                    i += 1 # Skip image line
                    continue
                else: 
                     i += 1
            
            # Extract Roaster
            roaster = None
            roaster_match = roaster_pattern.search(metadata_line)
            if roaster_match:
                roaster = roaster_match.group(1).strip()
                metadata_line = metadata_line[:roaster_match.start()].strip() # Remove roaster from string
            
            # Extract Process
            # We look for keywords in the comma-separated parts
            parts = [p.strip() for p in metadata_line.split(',')]
            found_processes = []
            remaining_parts = []
            
            for part in parts:
                is_process = False
                for k in process_keywords:
                    if k.lower() in part.lower():
                        found_processes.append(part)
                        is_process = True
                        break
                if not is_process:
                    remaining_parts.append(part)
            
            process = ", ".join(found_processes) if found_processes else None
            variety = ", ".join(remaining_parts) if remaining_parts else None

            current_bean = {
                "country": current_country,
                "name": bean_name,
                "roaster": roaster,
                "process": process,
                "variety": variety,
                "characteristics": {}
            }
            beans.append(current_bean)
            continue
        
        # Characteristics Bullets
        if line.startswith("-") and current_bean:
            content = line[1:].strip()
            if "：" in content: # key：value
                key, val = content.split("：", 1)
                key = key.strip()
                val = val.strip()
                
                # Map keys
                json_key = None
                if "香氣" in key or "乾香" in key: json_key = "aroma" # Treat dry aroma as aroma for simplicity or merge?
                elif "前段" in key: json_key = "beginning"
                elif "中段" in key: json_key = "middle"
                elif "後段" in key: json_key = "end"
                elif "Aftertaste" in key: json_key = "aftertaste"
                elif "Mouthfeel" in key: json_key = "mouthfeel"
                elif "Color tone" in key: json_key = "color_tone"
                
                if json_key:
                    if json_key in current_bean["characteristics"]:
                        current_bean["characteristics"][json_key] += f"; {val}"
                    else:
                        current_bean["characteristics"][json_key] = val

    return beans

def escape_sql(text):
    if text is None: return 'NULL'
    return "'" + text.replace("'", "''") + "'"

def generate_sql(beans):
    sql_lines = []
    sql_lines.append("-- Seed data generated from Notion Export")
    # Subquery to get a user ID. Using the first user found or a specific email if known.
    # We will use (SELECT id FROM profiles LIMIT 1) for safety in dev environment.
    
    for bean in beans:
        characteristics_json = json.dumps(bean["characteristics"], ensure_ascii=False)
        
        cols = ["user_id", "name", "country", "roaster", "variety", "process", "characteristics"]
        vals = [
            "(SELECT id FROM profiles LIMIT 1)",
            escape_sql(bean["name"]),
            escape_sql(bean["country"]),
            escape_sql(bean["roaster"]),
            escape_sql(bean["variety"]),
            escape_sql(bean["process"]),
            f"'{characteristics_json}'::jsonb"
        ]
        
        sql = f"INSERT INTO beans ({', '.join(cols)}) VALUES ({', '.join(vals)});"
        sql_lines.append(sql)
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    print(f"Parsing {SOURCE_FILE}...")
    beans = parse_markdown(SOURCE_FILE)
    print(f"Found {len(beans)} beans.")
    
    print(f"Generating SQL to {OUTPUT_FILE}...")
    sql_content = generate_sql(beans)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print("Done!")
