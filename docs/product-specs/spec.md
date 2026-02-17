# Project Specification: Coffee Brew Tracker

## 1. Project Overview

A web-based dashboard designed for coffee enthusiasts to log daily brew sessions, track coffee bean inventory (Pantry), and analyze brewing variables to achieve the "perfect cup."

---

## 2. Core Data Model

### 2.1 Bean Metadata (The "Pantry")

| Field | Type | Description |
| --- | --- | --- |
| **Name** | String | Name of the coffee (e.g., "Ethiopia Yirgacheffe") |
| **Roaster** | String | Name of the roasting company |
| **Origin** | String | Region/Country of origin |
| **Process** | String | Processing method (Washed, Natural, Honey, Anaerobic, etc.) |
| **Roast Date** | Date | When the coffee was roasted |
| **Total Weight** | Float | Initial weight in grams |
| **Status** | Boolean | Active (currently in use) or Finished |

### 2.2 Grinders

| Field | Type | Description |
| --- | --- | --- |
| **Name** | String | Name of the grinder (e.g., "Comandante C40") |
| **Type** | String | Manual / Electric |
| **Setting Type** | String | Description of settings (e.g., "Clicks", "Numerical Dial") |

### 2.3 Brew Log entry

| Field | Type | Description |
| --- | --- | --- |
| **Device** | String | V60, V60 Switch, Origami, Orea v4, OXO Rapid, or Custom |
| **Dose** (g) | Float | Weight of dry coffee in grams |
| **Ratio** () | Float | Water-to-coffee ratio (e.g., 16 for 1:16) |
| **Target Water** (g) | Float | Calculated as Dose * Ratio |
| **Grinder** | UUID | Reference to Grinders table |
| **Grind Setting** | Numeric | Setting value |
| **Water Temp** | Integer | Temperature (Stored in °C, conversion to °F available) |
| **Bloom Time** | Integer | Duration of the bloom phase in seconds (Auto-captured) |
| **Total Time** | Integer | Total brew duration in seconds |
| **Yield** (g) | Float | Final beverage weight in grams |
| **Sensory Data** | Text | Free-form description of the taste and results |

---

## 3. Technical Architecture

* **Platform:** Web-based (Mobile-responsive UI).
* **Frontend:** Next.js (Tailwind CSS, clean minimalist aesthetic).
* **Backend/Database:** Supabase (PostgreSQL).
* **Authentication:** Supabase Auth (Email/Google/Apple).
* **Unit System:** Weight is strictly Grams (g). Temperature supports Celsius (°C) and Fahrenheit (°F) conversion.

---

## 4. Functional Features & Logic

### 4.1 Automated Ratio Calculator

The app must dynamically calculate the required water input once the user enters the dose and desired ratio.

* **Formula:** 

* **Example:** If  and , the UI should instantly display .

### 4.2 Text-Based Export

A "Share" button that copies a formatted summary to the clipboard.

> **Brew Report: [Roaster] - [Bean Name]**
> * **Method:** [Device]
> * **Recipe:** [Dose]g / [Target Water]g (1:[Ratio])
> * **Parameters:** [Grinder] @ [Setting], [Temp]°
> * **Timing:** [Bloom]s Bloom / [Total]s Total
> * **Notes:** [Sensory Data]
> 
> 

---

## 5. User Workflow (The "Happy Path")

1. **Selection:** User opens the dashboard and selects a bean from their "Active Pantry" (or adds a new one).
2. **Configuration:** User inputs **Dose** and **Ratio**. The app provides the **Target Water** amount.
3. **Preparation:** User sets up the **Device** (V60, Orea, etc.) and records the **Grind Setting** and **Water Temp**.
4. **Brewing:** The user executes the brew using the integrated timer. Tapping "Start Bloom" initiates the clock; tapping "Finish Bloom" automatically captures the duration.
5. **Completion:** User logs the final **Total Time**, **Yield**, and **Taste Notes**.
6. **Persistence:** Data is saved to the cloud and appears in the "History" feed.

---

## 6. Future Roadmap (v2.0)

* **Inventory Tracking:** Automatically subtract brew dose from a total bean weight.
* **Visual Analytics:** Graphs showing the relationship between grind size and total brew time.
* **Photo Uploads:** Attach photos of the brew bed or the bean bag.