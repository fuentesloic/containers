import { defineEventHandler } from "h3";
import { faker } from "@faker-js/faker";

import type { Container } from "@/types/models/Container";
import { priorityLevels } from "@/types/enums/PriorityLevel";
import { containerStatuses } from "@/types/enums/ContainerStatus";
import { pickupStatuses } from "@/types/enums/PickupStatus";

const generateCargoManifest = (count: number): Container[] => {
  const containers: Container[] = [];

  for (let i = 0; i < count; i++) {
    containers.push({
      id: faker.string.uuid(),
      contentsDescription: faker.commerce.productName(),
      hsCode: faker.string.numeric(4),
      weightKg: faker.number.int({ min: 1, max: 1000 }),
      quantity: faker.number.int({ min: 1, max: 500 }),
      packageType: faker.helpers.arrayElement(["Box", "Pallet", "Crate"]),
      shipper: faker.company.name(),
      consignee: faker.company.name(),
      priorityLevel: faker.helpers.arrayElement(priorityLevels),
      containerStatus: faker.helpers.arrayElement(containerStatuses),
      pickupStatus: faker.helpers.arrayElement(pickupStatuses),
      carrierId: faker.string.uuid(),
      destination: faker.location.city(),
      aiPriorityScore: parseFloat(
        faker.number.float({ min: 0, max: 100 }).toFixed(2)
      ),
      pickupPlanId: faker.datatype.boolean() ? faker.string.uuid() : null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return containers;
};

export default defineEventHandler(() => {
  const containers = generateCargoManifest(3000);
  return containers
});
