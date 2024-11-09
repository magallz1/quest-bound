import { chart } from './chart';
import { charts } from './charts';
import { createChart } from './create-chart';
import { deleteChart } from './delete-chart';
import { updateChart } from './update-chart';

export const chartResolvers = {
  Query: {
    charts,
    chart,
  },
  Mutation: {
    createChart,
    updateChart,
    deleteChart,
  },
};
