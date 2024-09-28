<script setup lang="ts">
import { useContainersStore } from "@/store/containers";
import { PriorityLevel, priorityLevels } from "@/types/enums/PriorityLevel";
import { PickupStatus, pickupStatuses } from "@/types/enums/PickupStatus";
import { ContainerStatus, containerStatuses } from "@/types/enums/ContainerStatus";

const route = useRoute();
const router = useRouter();
const containersStore = useContainersStore();

const selectedPriorityLevels = ref(["critical"]);
const selectedContainerStatuses = ref(["ready_for_pickup"]);
const selectedPickupStatuses = ref(["unassigned"]);
const aiPriorityScoreMin = ref(50);
const aiPriorityScoreMax = ref(100);
const isLoading = ref(true);

// Apply query parameters to the filters on mount
onMounted(() => {
  const query = route.query;

  if (query.priorityLevel) {
    selectedPriorityLevels.value = Array.isArray(query.priorityLevel)
      ? query.priorityLevel
      : [query.priorityLevel];
  }

  if (query.containerStatus) {
    selectedContainerStatuses.value = Array.isArray(query.containerStatus)
      ? query.containerStatus
      : [query.containerStatus];
  }

  if (query.pickupStatus) {
    selectedPickupStatuses.value = Array.isArray(query.pickupStatus)
      ? query.pickupStatus
      : [query.pickupStatus];
  }

  if (query.aiPriorityScoreMin) {
    aiPriorityScoreMin.value = parseInt(query.aiPriorityScoreMin as string, 10);
  }

  if (query.aiPriorityScoreMax) {
    aiPriorityScoreMax.value = parseInt(query.aiPriorityScoreMax as string, 10);
  }

  updateQueryAndFetch();
});

const fetchContainers = async () => {
  isLoading.value = true;

  try {
    await containersStore.getContainers(
      {
        priorityLevel: selectedPriorityLevels.value as
          | PriorityLevel
          | PriorityLevel[],
        containerStatus: selectedContainerStatuses.value as
          | ContainerStatus
          | ContainerStatus[],
        pickupStatus: selectedPickupStatuses.value as
          | PickupStatus
          | PickupStatus[],
        aiPriorityScoreMin: aiPriorityScoreMin.value,
        aiPriorityScoreMax: aiPriorityScoreMax.value,
      },
      containersStore.page // Pass the current page
    );
  } catch (error) {
    console.error("Error fetching containers:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in filters
watch(
  [
    selectedPriorityLevels,
    selectedContainerStatuses,
    selectedPickupStatuses,
    aiPriorityScoreMin,
    aiPriorityScoreMax,
  ],
  () => {
    containersStore.page = 1; // Reset to page 1 when filters change
    updateQueryAndFetch();
  }
);

// Watch for changes in page
watch(
  () => containersStore.page,
  () => {
    updateQueryAndFetch();
  }
);

// Define table columns
const columns = [
  { key: "id", label: "Container ID" },
  { key: "priorityLevel", label: "Priority Level" },
  { key: "aiPriorityScore", label: "AI Priority Score" },
  { key: "containerStatus", label: "Container Status" },
  { key: "pickupStatus", label: "Pickup Status" },
];

// Helper functions for CSS classes
const getPriorityLevelClass = (level: PriorityLevel): string => {
  switch (level) {
    case PriorityLevel.Critical:
      return "bg-red-500 text-white font-bold animate-pulse";
    case PriorityLevel.High:
      return "bg-orange-500 text-white font-semibold";
    default:
      return;
  }
};

const getAiPriorityScoreClass = (score: number): string => {
  if (score <= 50) return;
  if (score > 80) {
    return "bg-red-500 text-white font-bold animate-pulse";
  } else if (score > 50) {
    return "bg-orange-500 text-white font-semibold";
  }
};

const updateQueryAndFetch = () => {
  const query = {
    priorityLevel: selectedPriorityLevels.value,
    containerStatus: selectedContainerStatuses.value,
    pickupStatus: selectedPickupStatuses.value,
    aiPriorityScoreMin: aiPriorityScoreMin.value,
    aiPriorityScoreMax: aiPriorityScoreMax.value,
    page: containersStore.page,
  };

  router.push({ path: route.path, query });
  fetchContainers();
};

const containers = computed(() =>
  containersStore.containers.map((container) => ({
    ...container,
    priorityLevel: {
      value: container.priorityLevel,
      class: getPriorityLevelClass(container.priorityLevel),
    },
    aiPriorityScore: {
      value: container.aiPriorityScore,
      class: getAiPriorityScoreClass(container.aiPriorityScore),
    },
    containerStatus: container.containerStatus,
    pickupStatus: container.pickupStatus,
  }))
);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Containers" />
      <UDashboardToolbar class="py-4">
        <template #right>
          <div class="flex gap-4">
            <div>
              <label for="priority-levels">Priority Level</label>
              <USelectMenu
                v-model="selectedPriorityLevels"
                :options="priorityLevels"
                multiple
              />
            </div>
            <div>
              <label for="ai-priority-score-min">Min Priority Score</label>
              <UInput
                id="ai-priority-score-min"
                v-model="aiPriorityScoreMin"
                type="number"
                placeholder="Min Score"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    %
                  </span>
                </template></UInput
              >
            </div>
            <div>
              <label for="ai-priority-score-max">Max Priority Score</label>
              <UInput
                id="ai-priority-score-max"
                v-model="aiPriorityScoreMax"
                type="number"
                placeholder="Max Score"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    %
                  </span>
                </template>
              </UInput>
            </div>
            <div>
              <label for="validation-status">Validation Status</label>
              <USelectMenu
                v-model="selectedContainerStatuses"
                label="Validation Status"
                :options="containerStatuses"
                multiple
              />
            </div>
            <div>
              <label for="pickup-status">Pickup Status</label>
              <USelectMenu
                v-model="selectedPickupStatuses"
                label="Pickup Status"
                :options="pickupStatuses"
                multiple
              />
            </div>
          </div>
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent v-if="isLoading">
        <Loader />
      </UDashboardPanelContent>

      <UDashboardPanelContent v-else>
        <UTable :rows="containers" :columns="columns" rowClass="text-center">
          <template #priorityLevel-data="{ row }">
            <span :class="row.priorityLevel.class">
              {{ row.priorityLevel.value }}
            </span>
          </template>
          <template #aiPriorityScore-data="{ row }">
            <span :class="row.aiPriorityScore.class">
              {{ row.aiPriorityScore.value }}
            </span>
          </template>
          <template #expand="{ row }">
            <UDashboardCard
              class="my-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
            >
              <template #header>
                <div class="w-full flex items-center justify-between">
                  <h3 class="text-lg font-semibold mb-3">Container Details</h3>
                  <div class="flex items-center space-x-2">
                    <label for="priority-select" class="font-medium"
                      >Change Priority:</label
                    >
                    <USelect
                      id="priority-select"
                      v-model="row.priorityLevel.value"
                      size="xl"
                      :options="['low', 'normal', 'high', 'critical']"
                    />
                  </div>
                </div>
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Container Details -->
                <div>
                  <div class="space-y-2">
                    <p>
                      <span class="font-medium">Contents:</span>
                      {{ row.contentsDescription }}
                    </p>
                    <p>
                      <span class="font-medium">HS Code:</span> {{ row.hsCode }}
                    </p>
                    <p>
                      <span class="font-medium">Weight (Kg):</span>
                      {{ row.weightKg }}
                    </p>
                    <p>
                      <span class="font-medium">Quantity:</span>
                      {{ row.quantity }}
                    </p>
                    <p>
                      <span class="font-medium">Package Type:</span>
                      {{ row.packageType }}
                    </p>
                  </div>
                </div>

                <!-- Logistics Information -->
                <div>
                  <h3 class="text-lg font-semibold mb-3">Logistics</h3>
                  <div class="space-y-2">
                    <p>
                      <span class="font-medium">Shipper:</span>
                      {{ row.shipper }}
                    </p>
                    <p>
                      <span class="font-medium">Consignee:</span>
                      {{ row.consignee }}
                    </p>
                    <p>
                      <span class="font-medium">Destination:</span>
                      {{ row.destination }}
                    </p>
                  </div>
                </div>
              </div>

              <template #footer>
                <div class="flex justify-end gap-4">
                  <!-- Action Buttons -->
                  <UButton
                    color="red"
                    variant="solid"
                  >
                    Contact Trucker Dispatcher
                  </UButton>
                  <UButton
                    color="blue"
                    variant="solid"
                  >
                    Generate Pickup Plan
                  </UButton>
                </div>
              </template>
            </UDashboardCard>
          </template>
        </UTable>

        <UPagination
          v-model="containersStore.page"
          :total="containersStore.totalCount"
          :page-count="containersStore.totalCount"
          class="ml-auto mt-4"
          show-last
          show-first
        />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
