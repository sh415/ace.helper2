<template>
  <div>
    <div class="flex py-4">
      <FloatLabel>
        <InputText id="naver_id" size="small" v-model="id" @blur="handleBlur" />
        <label class="text-xs " for="naver_id">네이버 아이디</label>
      </FloatLabel>
    </div>
    
    <div class="py-2"></div>

    <div clas="flex py-4">
      <FloatLabel>
        <InputText id="naver_pw" size="small" v-model="pw" @blur="handleBlur" />
        <label class="text-xs" for="naver_pw">네이버 패스워드</label>
      </FloatLabel>
    </div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";
  
  const id = ref();
  const pw = ref();

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    id.value = data.naver_id;
    pw.value = data.naver_pw;
  }

  const handleBlur = (event) => {
    const key = event.target.id;

    if (key === 'naver_id') {
      const settings = {
        key: key,
        value: id.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);

    } else if (key === 'naver_pw') {
      const settings = {
        key: key,
        value: pw.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);
    }
  };

</script>