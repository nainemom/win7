<template>
  <table :class="$style.calendarWidget">
    <thead>
      <th colspan="7">
        {{ readableFormat }}
      </th>
    </thead>
    <tbody>
      <tr
        v-for="(daysRow, i) in daysGrid"
        :key="i"
      >
        <td
          v-for="day in daysRow"
          :key="day.key"
          :class="day.class"
          v-text="day.value"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
  computed: {
    readableFormat() {
      return this.date.toDateString();
    },
    daysGrid() {
      const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
      const monthFirstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();
      const ret = [
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((value) => ({
          key: value,
          value,
          class: [],
        })),
      ];

      for (let i = 0; i < 6; i += 1) {
        const row = [];
        const dayStart = i * 7;
        for (let j = 0; j < 7; j += 1) {
          let value = (dayStart + j) - (monthFirstDay - 1);
          let isGray = true;
          let monthValue = month;
          if (value < 1) {
            value += daysInPrevMonth;
            monthValue -= 1;
          } else if (value > daysInMonth) {
            value -= daysInMonth;
            monthValue += 1;
          } else {
            isGray = false;
          }
          const isSelected = new Date(
            year,
            monthValue,
            value,
          ).toDateString() === new Date().toDateString();
          row.push({
            key: `day${(i * 7) + j}`,
            value,
            class: [isGray && 'gray', isSelected && 'selected'],
          });
        }
        ret.push(row);
      }
      return ret;
    },
  },
  style({ className }) {
    return [
      className('calendarWidget', {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        '& .gray': {
          opacity: 0.25,
        },
        '& .selected': {
          background: 'rgba(10, 148, 248, 0.1)',
          color: 'rgb(10, 148, 248)',
          fontWeight: 'bold',
          border: 'dotted 1px rgba(10, 148, 248, 0.9)',
          borderRadius: '4px',
        },
        '& td, & th': {
          padding: '3px 5px',
          border: 'solid 1px transparent',
        },
      }),
    ];
  },
};
</script>
