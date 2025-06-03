import { Movement } from '@/interfaces/interfaceMovement'
import { Href, router } from 'expo-router'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { TimelineEvent, TimelineProps } from "@/interfaces/interfaceComponents"

// Timeline constants
const timelineHeight = 400
const interval = 0.2

// Overlap check with types
const isOverlapping = (a: { start: number; end: number }, b: { start: number; end: number }): boolean =>
  a.start < b.end && b.start < a.end

// Color by level
const getColorByLevel = (level: string): string => {
  const colors: { [key: string]: string } = {
    bajo: '#B4F186',
    medio: '#868AF1',
    alto: '#FF8282'
  }
  return colors[level] || '#CCCCCC'
}

// Assign columns to events to avoid overlap
function assignColumns(events: TimelineEvent[]): (TimelineEvent & { column: number; maxColumns: number })[] {
  const columns: TimelineEvent[][] = []
  const result: (TimelineEvent & { column: number; maxColumns: number })[] = []

  for (const event of events) {
    let col = 0
    while (true) {
      const conflicts = columns[col]?.some((e) => isOverlapping(e, event))
      if (!conflicts) break
      col++
    }
    if (!columns[col]) columns[col] = []
    columns[col].push(event)
    // Initialize maxColumns as 1 (or 0), not null
    result.push({ ...event, column: col, maxColumns: 1 })
  }

  result.forEach((e) => {
    let max = 1
    result.forEach((other) => {
      if (isOverlapping(e, other)) {
        max = Math.max(max, (other.column ?? 0) + 1)
      }
    })
    e.maxColumns = max
  })

  return result
}

const Timeline = ({ movements }: TimelineProps) => {
  const processedMovements: TimelineEvent[] = movements.map(movement => ({
    title: movement.name,
    start: movement.start_time / 60,  // Convert seconds to minutes
    end: movement.end_time / 60,
    color: getColorByLevel(movement.level),
    id: movement.id,
    id_scene: movement.scene_id
  }))

  const events = assignColumns(processedMovements)
  const totalDuration = Math.max(...processedMovements.map(m => m.end), 0)

  // Generate labels every 0.2 seconds
  const timeLabels: number[] = []
  for (let t = 0; t <= totalDuration; t += interval) {
    timeLabels.push(parseFloat(t.toFixed(1)))
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.row}>
        {/* Time labels */}
        <View style={styles.timeLabels}>
          <Text style={styles.minutosLabel}>Minutos</Text>
          {timeLabels.map((label, idx) => (
            <Text
              key={idx}
              style={{
                height: (interval / totalDuration) * timelineHeight,
                fontSize: 12,
                color: '#999',
              }}
            >
              {label.toFixed(1)}
            </Text>
          ))}
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {events.map((item, index) => {
            const top = (item.start / totalDuration) * timelineHeight
            const height = ((item.end - item.start) / totalDuration) * timelineHeight
            const widthPercent = 100 / item.maxColumns
            const leftPercent = item.column * widthPercent

            return (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: `/movement/${item.id}` } as Href)}
                style={[
                  styles.movement,
                  {
                    top,
                    height,
                    backgroundColor: item.color,
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  },
                ]}
              >
                <Text style={styles.label}>{item.title}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default Timeline

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeLabels: {
    width: 40,
    justifyContent: 'space-between',
    height: timelineHeight,
  },
  timeline: {
    height: timelineHeight,
    width: '85%',
    borderLeftWidth: 2,
    borderColor: '#ccc',
    position: 'relative',
  },
  movement: {
    position: 'absolute',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  minutosLabel: {
    position: 'absolute',
    top: -30, // Adjust this value based on your layout needs
    left: 0,
    fontSize: 11,
    color: '#999',
  },
})