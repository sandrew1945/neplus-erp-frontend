<template>
  <q-markup-table>
    <thead>
      <tr>
        <th
          class="text-left"
        >
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
        <th class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
        <th class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
        <th class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
        <th class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
        <th class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="n in 5"
        :key="n"
      >
        <td class="text-left">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
        <td class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
        <td class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
        <td class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
        <td class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
        <td class="text-right">
          <q-skeleton
            animation="blink"
            type="text"
          />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>

export default {
  name: 'TableSkeleton'
}
</script>
