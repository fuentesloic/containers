<script setup lang="ts">
import type { Database } from "@/types/supabase";
import { useContainersStore } from "@/store/containers";
import {
  VisSingleContainer,
  VisDonut,
  VisBulletLegend,
  VisStackedBar,
} from "@unovis/vue";

const supabase = useSupabaseClient<Database>();
const containersStore = useContainersStore();

// Data properties
const highScoreNormalPriorityNotScanned = ref(0);
const highScoreNormalPriorityScanned = ref(0);
const readyForPickupUnassigned = ref(0);
const containersDeliveredByPriority = ref([]);
const totalContainersByPriority = ref([]);
const isLoading = ref(true);
const deliverySuccessRate = ref(0);

// Calculate delivery percentage for each priority level
const calculateDeliveryPercentage = (priorityLevel) => {
  const total =
    totalContainersByPriority.value.find(
      (p) => p.priorityLevel === priorityLevel
    )?.totalContainers || 0;

  const delivered =
    containersDeliveredByPriority.value.find(
      (p) => p.priorityLevel === priorityLevel
    )?.containersDelivered || 0;

  return total > 0 ? ((delivered / total) * 100).toFixed(2) : 0;
};

// Calculate the delivery success rate
const calculateDeliverySuccessRate = () => {
  const priorities = ["critical", "high", "normal", "low"];
  let totalContainers = 0;
  let totalDelivered = 0;

  priorities.forEach((priority) => {
    const total =
      totalContainersByPriority.value.find((p) => p.priorityLevel === priority)
        ?.totalContainers || 0;
    const delivered =
      containersDeliveredByPriority.value.find(
        (p) => p.priorityLevel === priority
      )?.containersDelivered || 0;

    totalContainers += total;
    totalDelivered += delivered;

    // Stop at the first non-fully delivered priority level
    if (totalDelivered < total) {
      deliverySuccessRate.value = (
        (totalDelivered / totalContainers) *
        100
      ).toFixed(2);
      return;
    }
  });

  // If all priorities are delivered
  deliverySuccessRate.value = (
    (totalDelivered / totalContainers) *
    100
  ).toFixed(2);
};

// Fetch data from the new view
const fetchDashboardData = async () => {
  const { data, error } = await supabase
    .from("containers_dashboard_view")
    .select("*");

  if (error) {
    console.error("Error fetching dashboard data:", error);
    return;
  }

  // Parse and assign the data to the dashboard card variables
  if (data) {
    highScoreNormalPriorityNotScanned.value = data.reduce(
      (sum, row) => sum + (row.high_score_normal_priority_not_scanned || 0),
      0
    );
    highScoreNormalPriorityScanned.value = data.reduce(
      (sum, row) =>
        sum + (row.high_score_normal_priority_scanned_or_ready || 0),
      0
    );
    readyForPickupUnassigned.value = data.reduce(
      (sum, row) => sum + (row.ready_for_pickup_unassigned || 0),
      0
    );
    containersDeliveredByPriority.value = data.map((row) => ({
      priorityLevel: row.priorityLevel,
      containersDelivered: row.containers_delivered || 0,
    }));
    totalContainersByPriority.value = data.map((row) => ({
      priorityLevel: row.priorityLevel,
      totalContainers: row.total_containers_by_priority || 0,
    }));

    // Calculate delivery success rate after data is fetched
    calculateDeliverySuccessRate();
  }
};

const chartData = computed(() =>
  containersDeliveredByPriority.value.map((priority) => ({
    key: priority.priorityLevel,
    value: priority.containersDelivered,
  }))
);

const priorityColors = {
  critical: "red",
  high: "orange",
  normal: "green",
  low: "blue",
};

const legendItems = computed(() =>
  containersDeliveredByPriority.value.map((priority) => ({
    name: `${
      priority.priorityLevel.charAt(0).toUpperCase() +
      priority.priorityLevel.slice(1)
    }: ${priority.containersDelivered}`,
    color: priorityColors[priority.priorityLevel],
  }))
);

const stackedBarData = computed(() => {
  const data = totalContainersByPriority.value.map((priority) => {
    const delivered =
      containersDeliveredByPriority.value.find(
        (p) => p.priorityLevel === priority.priorityLevel
      )?.containersDelivered || 0;
    return {
      category:
        priority.priorityLevel.charAt(0).toUpperCase() +
        priority.priorityLevel.slice(1),
      delivered: delivered,
      notDelivered: priority.totalContainers - delivered,
    };
  });
  console.log("stackedBarData:", data);
  return data;
});

const maxContainers = computed(() => {
  return Math.max(
    ...stackedBarData.value.map((d) => d.delivered + d.notDelivered)
  );
});

// Add this above your existing computed properties
const kpis = ref([
  {
    feature: "Container Validation and Prioritization",
    description: "Accuracy and relevance of AI suggestion.",
    kpiName: "Container Prioritization Accuracy",
    target: "≥ 85%",
    realResult: "45%",
    gap: "-30%",
  },
  {
    feature: "Recommendation and Approval Workflow",
    description: "Logistics Coordinators pickup plan recommendation to Trucker Dispatchers.",
    kpiName: "Pickup Approval Rate",
    target: "≥ 90%",
    realResult: "70%",
    gap: "-20%",
  },
  {
    feature: "Real-Time Tracking and Visualization",
    description: "Flow of containers from arrival to pickup.",
    kpiName: "Average Pickup Confirmation Time",
    target: "≤ 15 minutes",
    realResult: "20 minutes",
    gap: "+33%",
  },
  {
    feature: "Communication Channels",
    description: "Resolution of issue with direct canal",
    kpiName: "Dispatcher Responsiveness",
    target: "≤ 10 minutes",
    realResult: "12 minutes",
    gap: "+20%",
  },
  {
    feature: "Container Dwell Time Monitoring",
    description: "Tracks the time each container remains at the unloading area.",
    kpiName: "Container Dwell Time",
    target: "≤ 30 minutes for high-priority containers",
    realResult: "35 minutes",
    gap: "+16.67%",
  },
  {
    feature: "Delay Identification",
    description: "Automatically identifies and flags containers that exceed the expected pickup time.",
    kpiName: "Delay Identification Rate",
    target: "≥ 95%",
    realResult: "92%",
    gap: "-3%",
  },
]);

// Fetch dashboard data on component mount
onMounted(async () => {
  await fetchDashboardData();
  isLoading.value = false;
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Containers Dashboard">
        <template #right>
          <UButton
            label="Generate Manifest"
            color="gray"
            @click="containersStore.upsertContainers()"
          />
        </template>
      </UDashboardNavbar>

      <!-- Show Loader while fetching data -->
      <UDashboardPanelContent v-if="isLoading">
        <Loader />
      </UDashboardPanelContent>

      <!-- Render dashboard content when data is available -->
      <UDashboardPanelContent v-else>
        <!-- Section 1: Required Action -->
        <h2 class="text-xl font-bold mb-8">Requires Action</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Card 1.1: Urgent Review (Scanned or Ready for Pickup) -->
          <UDashboardCard
            title="Urgent Review (Scanned or Ready for Pickup)"
            description="High priority containers that have been scanned or are ready for pickup"
          >
            <div class="flex flex-col min-h-32">
              <p class="text-2xl">
                <span class="text-red-400">{{
                  highScoreNormalPriorityScanned
                }}</span>
                containers need <span class="text-red-400">urgent review</span>
              </p>
              <div class="flex justify-end mt-auto">
                <UButton
                  color="primary"
                  @click="
                    $router.push({
                      path: '/containers',
                      query: {
                        priorityLevel: ['high', 'critical'],
                        aiPriorityScoreMin: 80,
                        aiPriorityScoreMax: 100,
                        containerStatus: ['ready_for_pickup', 'scanned'],
                        pickupStatus: ['unassigned', 'canceled'],
                      },
                    })
                  "
                >
                  View Containers
                </UButton>
              </div>
            </div>
          </UDashboardCard>

          <!-- Card 1.2: High Score Normal Priority Containers Not Scanned -->
          <UDashboardCard
            title="Anomalous Container Priority (Not Scanned)"
            description="Containers identified by AI as high priority but not scanned yet"
          >
            <div class="flex flex-col min-h-32">
              <p class="text-2xl">
                <span class="text-orange-400">{{
                  highScoreNormalPriorityNotScanned
                }}</span>
                containers need
                <span class="text-orange-400">to be reviewed</span>
              </p>
              <div class="flex justify-end mt-auto">
                <UButton
                  color="primary"
                  @click="
                    $router.push({
                      path: '/containers',
                      query: {
                        priorityLevel: ['low', 'normal'],
                        containerStatus: ['pending_unload', 'rejected'],
                        aiPriorityScoreMin: 80,
                        aiPriorityScoreMax: 100,
                        pickupStatus: ['unassigned', 'canceled'],
                      },
                    })
                  "
                >
                  View Containers
                </UButton>
              </div>
            </div>
          </UDashboardCard>
        </div>

        <!-- Section 2: Statistic View -->
        <h2 class="text-xl font-bold my-8">Statistic View</h2>
        <div class="grid grid-cols-2 gap-4">
          <!-- Card 2.1: Containers Delivered by Priority -->
          <UDashboardCard>
            <div class="flex items-center justify-between">
              <VisSingleContainer :height="200">
                <VisDonut
                  :color="(_, i) => ['red', 'orange', 'blue', 'green'][i]"
                  :value="(d) => d.value"
                  :data="chartData"
                  :showEmptySegments="true"
                  :padAngle="0.01"
                  :arcWidth="50"
                />
              </VisSingleContainer>
            </div>
            <template #header>
              <h3 class="font-bold">Containers Delivered by Priority</h3>
              <div class="flex">
                <p class="text-xl ml-auto">
                  Delivery Score:
                  <span class="text-orange-500">{{ deliverySuccessRate }}</span>
                </p>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-center">
                <VisBulletLegend :items="legendItems" />
              </div>
            </template>
          </UDashboardCard>

          <!-- Card 2.2: Total Containers by Priority Level -->
          <UDashboardCard title="Total Containers by Priority Level">
            <div class="flex flex-col items-center w-full">
              <!-- Delivered Percentage Below the Chart -->
              <div class="mt-8 w-full">
                <ul class="grid grid-cols-2 gap-8">
                  <li
                    v-for="priority in totalContainersByPriority"
                    :key="priority.priorityLevel"
                    class="text-center"
                  >
                    <span class="font-semibold">
                      {{
                        priority.priorityLevel.charAt(0).toUpperCase() +
                        priority.priorityLevel.slice(1)
                      }}: </span
                    ><br />
                    {{ priority.totalContainers }} containers<br />
                    <span class="text-green-500">
                      Delivered:
                      {{ calculateDeliveryPercentage(priority.priorityLevel) }}%
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </UDashboardCard>
        </div>

        <!-- Section 3: Key Features -->
        <h2 class="text-xl font-bold my-8">KPIs View</h2>
        <div class="grid grid-cols-2 gap-4">
          <UDashboardCard
            v-for="kpi in kpis"
            :key="kpi.kpiName"
            :title="kpi.feature"
            :description="kpi.description"
          >
            <div class="mt-4">
              <p><strong>KPI:</strong> {{ kpi.kpiName }}</p>
              <p><strong>Target:</strong> {{ kpi.target }}</p>
              <p><strong>Real Result:</strong> {{ kpi.realResult }}</p>
              <p>
                <strong>Gap: </strong>
                <span
                  :class="{
                    'text-red-500': kpi.gap.startsWith('-'),
                    'text-green-500': kpi.gap.startsWith('+'),
                  }"
                >
                  {{ kpi.gap }}
                </span>
              </p>
            </div>
          </UDashboardCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
