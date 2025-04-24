<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-4 justify-between items-center">
      <button
        @click="goToDate(getDate(-1))"
        class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        <ArrowLeft />
        Previous Day
      </button>

      <input
        type="date"
        :value="date"
        @change="(e) => goToDate(e.target.value)"
        class="border rounded-xl px-4 py-2 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500"
      />

      <button
        @click="goToDate(getDate(1))"
        :disabled="isNextDateInFuture"
        :title="isNextDateInFuture ? 'You cannot mark habits for future dates' : ''"
        class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowRight />
        Next Day
      </button>
    </div>

    <HabitList :date="date" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ArrowLeft } from 'lucide-vue-next'
import HabitList from '../components/HabitList.vue'

const route = useRoute()
const router = useRouter()

const date = computed(() => route.params.date)

function getDate(offset) {
  const current = new Date(route.params.date)
  current.setDate(current.getDate() + offset)
  return current.toISOString().slice(0, 10)
}

function goToDate(targetDate) {
  router.push(`/day/${targetDate}`)
}

const isNextDateInFuture = computed(() => {
  const next = new Date(getDate(1))
  const today = new Date()

  next.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return next > today
})
</script>

<style scoped>
button {
  display: flex;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover {
  transition: background-color 0.3s ease;
}
</style>
