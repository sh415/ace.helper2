<template>
  <div>
    <div class="flex py-4">
      <FloatLabel>
        <InputText id="auction_id" size="small" v-model="id" @blur="handleBlur" />
        <label class="text-xs " for="auction_id">옥션 아이디</label>
      </FloatLabel>
    </div>
    
    <div class="py-2"></div>

    <div clas="flex py-4">
      <FloatLabel>
        <InputText id="auction_pw" size="small" v-model="pw" @blur="handleBlur" />
        <label class="text-xs" for="auction_pw">옥션 패스워드</label>
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

    id.value = data.auction_id;
    pw.value = data.auction_pw;
  }

  const handleBlur = (event) => {
    const key = event.target.id;

    if (key === 'auction_id') {
      const settings = {
        key: key,
        value: id.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);

    } else if (key === 'auction_pw') {
      const settings = {
        key: key,
        value: pw.value.trim(),
      }
      window.electron.ipcRenderer.send('updateSettings', settings);
    }
  };

</script>