<template>
  <div>
    <div class="flex pb-2">
      <FloatLabel>
        <InputText class="w-96" id="openai_key" size="small" v-model="openaiKey" @blur="handleBlur" />
        <label class="text-xs" for="openai_key">OpenAI_API_KEY</label>
      </FloatLabel>
    </div>

    <div class="flex px-2 pb-4">
      <div v-if="openaiChecking">
        <ProgressSpinner 
          style="width: 20px; 
          height: 20px" 
          strokeWidth="8" 
          fill="transparent" 
          animationDuration="2.5s" 
          aria-label="Custom ProgressSpinner" 
        />
      </div>
      <div v-else-if="isValiedKey" class="flex">
        <div class="text-xs text-green-500">키가 유효합니다.</div>
      </div>
      <div v-else class="flex">
        <div class="text-xs text-red-500">키가 유효하지 않습니다.</div>
      </div>
    </div>
    
    <div class="flex py-4">
      <div class="text-xs font-semibold text-slate-800 px-2">AI 포스팅1 사용</div>
      <ToggleSwitch id="openai_use_question1" v-model="openaiUseQuestion1" @change="toggleChangeQuestion1" />
    </div>

    <div class="flex py-4">
      <FloatLabel class="w-full md:w-48">
        <Select v-if="openaiUseQuestion1" class="w-full text-xs" v-model="openaiQuestion1" inputId="openai_question1" :options="openaiQuestion1s" optionLabel="name" @change="openaiQuestion1Change" />
        <Select v-else class="w-full text-xs" v-model="openaiQuestion1" inputId="openai_question1" :options="openaiQuestion1s" optionLabel="name" @change="openaiQuestion1Change" disabled />
        <label class="text-xs" for="openai_question1">AI 포스팅1 사용 위치</label>
      </FloatLabel>
    </div>

    <div clas="flex py-4">
      <FloatLabel>
        <Textarea class="w-96" id="openai_question1_plus" v-model="openaiQuestion1Plus" rows="3" cols="30" style="resize: none" @blur="handleBlur" />
        <label class="text-xs" for="openai_question1_plus">AI 포스팅1 에 사용할 질문을 적어보세요.</label>
      </FloatLabel>
    </div>

    <div class="py-2"></div>

    <div class="flex py-4">
      <div class="text-xs font-semibold text-slate-800 px-2">AI 포스팅2 사용</div>
      <ToggleSwitch id="openai_use_question2" v-model="openaiUseQuestion2" @change="toggleChangeQuestion2" />
    </div>

    <div class="py-1"></div>

    <div clas="flex py-4">
      <FloatLabel>
        <Textarea class="w-96" id="openai_question2" v-model="openaiQuestion2" rows="4" cols="30" style="resize: none" @blur="handleBlur" />
        <label class="text-xs" for="openai_question2">AI 포스팅2 에 사용할 질문을 적어보세요.</label>
      </FloatLabel>
    </div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";
  
  const openaiKey = ref();
  const isValiedKey = ref(false);
  const openaiChecking = ref(true);
  const openaiUseQuestion1 = ref();
  const openaiQuestion1 = ref();
  const openaiQuestion1Plus = ref();
  const openaiQuestion1s = ref([
    { name: '무작위', code: 0 },
    { name: '본문1', code: 1 },
    { name: '본문2', code: 2 },
    { name: '본문3', code: 3 },
    { name: '본문4', code: 4 },
  ])
  const openaiUseQuestion2 = ref();
  const openaiQuestion2 = ref();

  onMounted (async () => {
    await getData();
    await checkApiKey();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    openaiKey.value = data.openai_key;
    openaiUseQuestion1.value = data.openai_use_question1;
    openaiQuestion1.value =  openaiQuestion1s.value.find(item => item.code === data.openai_question1);
    openaiQuestion1Plus.value = data.openai_question1_plus;
    openaiUseQuestion2.value = data.openai_use_question2;
    openaiQuestion2.value = data.openai_question2;
  }

  const checkApiKey = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('checkApiKey', openaiKey.value);

      if (result) {
        isValiedKey.value = true;

      } else {
        isValiedKey.value = false;
      }

    } catch (error) {
      console.log(error);
      isValiedKey.value = false;
      
    } finally {
      openaiChecking.value = false;
    }
  }

  const handleBlur = async (event) => {
    const key = event.target.id;
    if (key === 'openai_key') {
      const settings = {
        key: key,
        value: openaiKey.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);

      await checkApiKey();

    } else if (key=== 'openai_question1_plus') {
      const settings = {
        key: key,
        value: openaiQuestion1Plus.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);

    } else if (key === 'openai_question2') {
      const settings = {
        key: key,
        value: openaiQuestion2.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);
    }
  };

  const toggleChangeQuestion1 = (event) => {
    const settings = {
      key: 'openai_use_question1',
      value: openaiUseQuestion1.value,
    }
    window.electron.ipcRenderer.send('updateSettings', settings);
  }

  const openaiQuestion1Change = (event) => {
    const settings = {
      key: 'openai_question1',
      value: openaiQuestion1.value.code,
    }
    window.electron.ipcRenderer.send('updateSettings', settings);
  }

  const toggleChangeQuestion2 = (event) => {
    const settings = {
      key: 'openai_use_question2',
      value: openaiUseQuestion2.value,
    }
    window.electron.ipcRenderer.send('updateSettings', settings);
  }

</script>