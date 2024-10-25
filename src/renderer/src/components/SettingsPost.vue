<template>
  <div>
    <div class="flex py-4">
      <FloatLabel class="w-full md:w-48">
        <Select class="w-full text-xs" v-model="isPublish" inputId="isPublish" :options="isPublishs" optionLabel="name" @change="isPublishsChange" />
        <label class="text-xs" for="isPublish">발행·저장 여부</label>
      </FloatLabel>
    </div>

    <div class="py-2"></div>

    <div class="flex py-4">
      <FloatLabel class="w-full md:w-48">
        <Select class="w-full text-xs" v-model="quote" inputId="quote" :options="quotes" optionLabel="name" @change="quoteChange" />
        <label class="text-xs" for="quote">인용구 타입</label>
      </FloatLabel>
    </div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";
  
  const isPublish = ref();
  const isPublishs = ref([
    { name: '발행', code: true },
    { name: '저장', code: false },
  ])
  const quote = ref();
  const quotes = ref([
    { name: '랜덤', code: 0 },
    { name: '따옴표', code: 1 },
    { name: '버티컬 라인', code: 2 },
    { name: '말풍선', code: 3 },
    { name: '라인&따옴표', code: 4 },
    { name: '포스트잇', code: 5 },
    { name: '프레임', code: 6 },
  ])

  onMounted (async () => {
    await getData();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    isPublish.value =  isPublishs.value.find(item => item.code === data.is_publish);
    quote.value = quotes.value.find(item => item.code === data.quote);
  }

  const isPublishsChange = (event) => {
    const settings = {
      key: 'is_publish',
      value: isPublish.value.code,
    }
    window.electron.ipcRenderer.send('updateSettings', settings);
  }

  const quoteChange = (event) => {
    const settings = {
      key: 'quote',
      value: quote.value.code,
    }
    window.electron.ipcRenderer.send('updateSettings', settings);
  }

</script>