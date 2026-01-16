import { format } from 'date-fns'
import { LogWithRelations } from '@/types/logs'

export function generateLogSummary(log: LogWithRelations): string {
    const date = format(new Date(log.created_at), 'MMM d, yyyy')
    const bean = log.beans ? `${log.beans.name} (${log.beans.roaster || 'Unknown Roaster'})` : 'Unknown Bean'
    const device = log.methods?.name || log.device || 'Unknown Method'

    let stats = ''
    if (log.dose) stats += `\n📏 Dose: ${log.dose}g`
    if (log.ratio) stats += `\n💧 Ratio: 1:${log.ratio}`
    if (log.total_time) {
        const mins = Math.floor(log.total_time / 60)
        const secs = log.total_time % 60
        stats += `\n⏱️ Time: ${mins}:${secs.toString().padStart(2, '0')}`
    }

    const notes = log.notes ? `\n📝 Notes: ${log.notes}` : ''

    return `☕ Brew Log - ${date}\n${bean} on ${device}${stats}${notes}`
}
