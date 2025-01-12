<template>
  <div>
    <template v-if="data.length !== 0 || loading === false">
      <q-table
        :title="tabTitle"
        :rows="props.data"
        :columns="columns"
        :row-key="rowKey"
        v-model:pagination="updatePage"
        :loading="loading"
        separator="cell"
        :hide-pagination="pagination === null ? true : false"
        @request="doRequest"
        :grid="$q.screen.lt.sm"
        no-data-label="No Data"
      >
        <template
          v-if="$q.screen.gt.xs"
          v-slot:body="props"
        >
          <q-tr :props="props">
            <template v-for="column in columns">
              <template v-if="column.type === 'fixcode'">
                <q-td
                  :key="column.name"
                  :width="column.width ? column.width : ''"
                  :props="props"
                >
                  {{ fixcodeFilter(props.row[column.name]) }}
                </q-td>
              </template>
              <template v-else-if="column.type === 'date'">
                <q-td
                  :key="column.name"
                  :width="column.width ? column.width : ''"
                  :props="props"
                >
                  {{ dateFormatter(props.row[column.name], column.format) }}
                </q-td>
              </template>
              <template v-else-if="column.type === 'slot'">
                <slot :row="props.row" />
              </template>
              <template v-else-if="column.type === 'rate'">
                <q-td
                  :key="column.name"
                  :width="column.width ? column.width : ''"
                  :props="props"
                >
                  <q-rating
                    v-model="props.row[column.field]"
                    size="2em"
                    :max="column.max"
                    color="grey"
                    :color-selected="column.colors"
                    readonly
                  />
                </q-td>
              </template>
              <template v-else-if="column.type === 'fixedSize'">
                <q-td
                  :key="column.name"
                  :width="column.width ? column.width : ''"
                  :props="props"
                >
                  <q-tooltip anchor="top middle" max-width="500px">
                    {{ props.row[column.name] }}
                  </q-tooltip>
                  {{ props.row[column.name].slice(column.startIdx, column.startIdx + column.length) }}
                </q-td>
              </template>
              <template v-else>
                <q-td
                  :key="column.name"
                  :width="column.width ? column.width : ''"
                  :props="props"
                >
                  {{ props.row[column.name] }}
                </q-td>
              </template>
            </template>
          </q-tr>
        </template>
        <template
          v-else
          v-slot:item="props"
        >
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
          >
            <q-card :class="props.selected ? 'bg-grey-2' : ''">
              <q-list dense>
                <q-item
                  v-for="column in columns"
                  :key="column.name"
                >
                  <q-item-section>
                    <q-item-label>{{ column.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <template v-if="column.type === 'fixcode'">
                      <q-item-label caption>
                        {{ fixcodeFilter(props.row[column.name]) }}
                      </q-item-label>
                    </template>
                    <template v-else-if="column.type === 'date'">
                      <q-item-label caption>
                        {{ dateFormatter(props.row[column.name], column.format) }}
                      </q-item-label>
                    </template>
                    <template v-else-if="column.type === 'slot'">
                      <q-item-label caption>
                        <slot :row="props.row" />
                      </q-item-label>
                    </template>
                    <template v-else-if="column.type === 'rate'">
                      <q-item-label caption>
                        <q-rating
                          v-model="props.row[column.field]"
                          size="2em"
                          :max="column.max"
                          color="grey"
                          :color-selected="column.colors"
                          readonly
                        />
                      </q-item-label>
                    </template>
                    <template v-else-if="column.type === 'fixedSize'">
                      <q-item-label caption>
                        :key="column.name"
                        :width="column.width ? column.width : ''"
                        :props="props"
                      >
                        <q-tooltip anchor="top middle" max-width="80%">
                          {{ props.row[column.name] }}
                        </q-tooltip>
                        {{ props.row[column.name].slice(column.startIdx, column.startIdx + column.length) }}
                      </q-item-label>
                    </template>
                    <template v-else>
                      <q-item-label caption>
                        {{ props.row[column.name] }}
                      </q-item-label>
                    </template>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
    </template>
    <template v-else>
      <Skeleton />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from 'vue'
import { getfixCodeDesc } from 'src/utils/fixcode'
import Skeleton from 'src/components/PaginationTable/skeleton'
import { date } from 'quasar'

const props = defineProps({
  rowKey: {
      required: true,
      type: String
  },
  data: {
    required: true,
    type: Array,
    default: null
  },
  columns: {
    required: true,
    type: Array
  },
  tabTitle: {
    required: false,
    type: String,
    default: ''
  },
  loading: {
    required: true,
    type: Boolean
  },
  pagination: {
    required: false,
    type: Object,
    default: null
  },
  query: {
    required: true,
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['update:pagination'])
const updatePage = computed({
  get() {
    return props.pagination
  },
  set(val) {
    emit('update:pagination', val)
  }
})

const fixcodeFilter = (fixcode) => {
  if (!fixcode) {
    return ''
  }
  return getfixCodeDesc(fixcode)
}
const dateFormatter = (val, format) => {
  if (!val) {
    return ''
  }
  return date.formatDate(val, format ? format : 'YYYY-MM-DD')
}
const doRequest = (requestProp) => {
  // don't forget to update local pagination object
  updatePage.value = requestProp.pagination
  props.query()
}

</script>
