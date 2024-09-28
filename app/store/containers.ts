import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Database } from "@/types/supabase";
import type { Container, ContainerFilters } from "@/types/models/Container";

const CONTAINERS_TABLE_NAME = "containers";

export const useContainersStore = defineStore("containers", () => {
  const supabase = useSupabaseClient<Database>();

  // State
  const containers = ref<Container[]>([]);
  const limit = ref(20); // Containers per page
  const page = ref(1); // Current page
  const totalCount = ref(0); // For storing the total number of containers

  // Computed
  const hasContainers = computed(() => Boolean(containers.value?.length));

  // Get containers from API with pagination
  const getContainers = async (
    filters?: ContainerFilters,
    currentPage: number = page.value,
    pageSize: number = limit.value
  ) => {
    try {
      const offset = (currentPage - 1) * pageSize;
  
      let query = supabase.from(CONTAINERS_TABLE_NAME).select("*", { count: "exact" });
  
      // Apply filters if provided
      if (filters) {
        if (filters.pickupStatus) {
          if (Array.isArray(filters.pickupStatus)) {
            query = query.in("pickupStatus", filters.pickupStatus);
          } else {
            query = query.eq("pickupStatus", filters.pickupStatus);
          }
        }
        if (filters.priorityLevel) {
          if (Array.isArray(filters.priorityLevel)) {
            query = query.in("priorityLevel", filters.priorityLevel);
          } else {
            query = query.eq("priorityLevel", filters.priorityLevel);
          }
        }
        if (filters.containerStatus) {
          if (Array.isArray(filters.containerStatus)) {
            query = query.in("containerStatus", filters.containerStatus);
          } else {
            query = query.eq("containerStatus", filters.containerStatus);
          }
        }
        if (filters.aiPriorityScoreMin) {
          query = query.gte("aiPriorityScore", filters.aiPriorityScoreMin);
        }
        if (filters.aiPriorityScoreMax) {
          query = query.lte("aiPriorityScore", filters.aiPriorityScoreMax);
        }
      }
  
      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);
  
      const { data, count, error } = await query;
  
      if (error) throw error;
  
      // Update state with data and total count
      containers.value = data || [];
      totalCount.value = count || 0;
      page.value = currentPage;
      limit.value = pageSize;
    } catch (error) {
      console.error("Error fetching containers:", error);
    }
  };

  // Insert containers to DB
  const upsertContainers = async () => {
    const response = await fetch("/api/containers");
    const _containers: Container[] = await response.json();
    
    try {
      const { data, error } = await supabase
        .from(CONTAINERS_TABLE_NAME)
        .insert(_containers);
      
      if (data) containers.value = data as Container[]
      if (error) throw error;
    } catch (error) {
      console.error("Error upserting containers:", error);
    }
  };

  // Reset containers
  const reset = () => {
    containers.value = [];
    totalCount.value = 0;
    page.value = 1;
  };

  return {
    containers,
    totalCount,
    page,
    limit,
    hasContainers,
    getContainers,
    upsertContainers,
    reset,
  };
});