<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <h1 class="text-3xl font-semibold text-center">Habit Tracker</h1>
    </header>

    <main class="flex-grow p-4">
      <router-view />
    </main>

    <footer class="bg-gray-800 text-white p-2 text-center text-sm">
      <p>2025 Habit Tracker App</p>
    </footer>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f7f7;
}
</style>
