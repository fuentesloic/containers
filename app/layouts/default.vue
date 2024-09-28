<script setup lang="ts">
const links = [{
  label: "Dashboard",
  to: "/",
  icon: "i-heroicons-squares-2x2"
},
{
  label: "Containers",
  to: "/containers",
  icon: "i-heroicons-table-cells"
}]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-globe-americas" class="w-8 h-8" />
            <h1 class="font-bold text-2xl">Ivado Port</h1>
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />

        <template #footer>
          Loïc Fuentes
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>
