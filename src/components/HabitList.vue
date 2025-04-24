<template>
  <div class="space-y-4">
    <form @submit.prevent="addHabit" class="flex gap-2 items-center">
      <input
        v-model="newHabit"
        type="text"
        placeholder="Add a new habit..."
        class="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
      >
        +
      </button>
    </form>

    <ul class="space-y-3">
      <li
        v-for="habit in activeHabits"
        :key="habit"
        class="flex items-center justify-between bg-white shadow p-4 rounded-xl"
      >
        <div class="flex items-center gap-4 w-full">
          <template v-if="editingHabit === habit">
            <input
              v-model="editedHabitName"
              class="flex-1 px-2 py-1 border rounded"
              @keyup.enter="saveEditedHabit(habit)"
              @blur="cancelEditing"
              autofocus
            />
          </template>
          <template v-else>
            <span class="text-gray-800 text-lg font-medium flex-1">{{ habit }}</span>
          </template>

          <input
            type="checkbox"
            class="w-5 h-5 accent-blue-500"
            :checked="isCompleted(habit)"
            @change="toggleHabit(habit)"
            :disabled="isFutureDate"
          />

          <div class="flex gap-2 text-sm">
            <button @click="startEditing(habit)" class="text-blue-600 hover:underline">
              <Pencil />
            </button>
            <button @click="stopHabit(habit)" class="text-yellow-600 hover:underline">
              <CirclePause />
            </button>
            <button @click="deleteHabit(habit)" class="text-red-600 hover:underline">
              <Trash />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { Pencil, CirclePause, Trash } from 'lucide-vue-next'
const props = defineProps({ date: String })

const newHabit = ref('')
const habitNames = ref([])
const completedHabits = ref([])
const stoppedHabits = ref([])
const editingHabit = ref(null)
const editedHabitName = ref('')

function loadHabits() {
  habitNames.value = JSON.parse(localStorage.getItem('habit-names') || '[]')
  stoppedHabits.value = JSON.parse(localStorage.getItem('stopped-habits') || '[]')
}

function saveHabits() {
  localStorage.setItem('habit-names', JSON.stringify(habitNames.value))
}

function addHabit() {
  const trimmed = newHabit.value.trim()
  if (!trimmed || habitNames.value.includes(trimmed)) return
  habitNames.value.push(trimmed)
  saveHabits()
  newHabit.value = ''
}

function loadCompletedHabits(date) {
  const stored = localStorage.getItem(`habits-${date}`)
  completedHabits.value = stored ? JSON.parse(stored) : []
}

function isCompleted(habitName) {
  return completedHabits.value.includes(habitName)
}

function toggleHabit(habitName) {
  if (isCompleted(habitName)) {
    completedHabits.value = completedHabits.value.filter((h) => h !== habitName)
  } else {
    completedHabits.value.push(habitName)
  }
  localStorage.setItem(`habits-${props.date}`, JSON.stringify(completedHabits.value))
}

function startEditing(habit) {
  editingHabit.value = habit
  editedHabitName.value = habit
}

function cancelEditing() {
  editingHabit.value = null
  editedHabitName.value = ''
}

function saveEditedHabit(oldName) {
  const newName = editedHabitName.value.trim()
  if (!newName || habitNames.value.includes(newName)) return

  if (!window.confirm(`Rename "${oldName}" to "${newName}"?`)) {
    cancelEditing()
    return
  }

  const index = habitNames.value.indexOf(oldName)
  if (index !== -1) habitNames.value[index] = newName

  for (let key in localStorage) {
    if (key.startsWith('habits-')) {
      const dayHabits = JSON.parse(localStorage.getItem(key))
      const idx = dayHabits.indexOf(oldName)
      if (idx !== -1) {
        dayHabits[idx] = newName
        localStorage.setItem(key, JSON.stringify(dayHabits))
      }
    }
  }

  const stopDate = localStorage.getItem(`stop-date-${oldName}`)
  if (stopDate) {
    localStorage.setItem(`stop-date-${newName}`, stopDate)
    localStorage.removeItem(`stop-date-${oldName}`)
  }

  saveHabits()
  cancelEditing()
}

function stopHabit(habit) {
  if (window.confirm(`Stop tracking "${habit}" from today onward?`)) {
    localStorage.setItem(`stop-date-${habit}`, props.date)
    loadHabits()
  }
}

function deleteHabit(habit) {
  if (!window.confirm(`Are you sure you want to delete "${habit}" and all its data?`)) return

  habitNames.value = habitNames.value.filter((h) => h !== habit)
  saveHabits()
  localStorage.removeItem(`stop-date-${habit}`)

  for (let key in localStorage) {
    if (key.startsWith('habits-')) {
      const dayHabits = JSON.parse(localStorage.getItem(key))
      const updated = dayHabits.filter((h) => h !== habit)
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }
}

const activeHabits = computed(() => {
  const today = props.date
  return habitNames.value.filter((habit) => {
    const stopDate = localStorage.getItem(`stop-date-${habit}`)
    return !stopDate || today < stopDate
  })
})

const isFutureDate = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return props.date > today
})

watch(
  () => props.date,
  (date) => loadCompletedHabits(date),
  { immediate: true },
)

onMounted(() => {
  loadHabits()
})
</script>
