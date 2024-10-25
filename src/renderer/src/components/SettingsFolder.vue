<template>
  <div>
    <div class="flex items-center py-4">
      <div class="pr-1">
        <Button icon="pi pi-folder" id="folder_start" size="small" severity="contrast" aria-label="Star" @click="folderDialog" />
      </div>
      <FloatLabel>
        <InputText class="w-96" id="folder_start" size="small" v-model="folderStart" disabled />
        <label class="text-xs" for="folder_start">블로그 시작 폴더</label>
      </FloatLabel>
    </div>
    
    <div class="flex items-center py-4"> <!-- 'class' 속성을 올바르게 사용 -->
      <div class="pr-1">
        <Button icon="pi pi-folder" id="folder_end" size="small" severity="contrast" aria-label="Star"  @click="folderDialog" />
      </div>
      <FloatLabel>
        <InputText class="w-96" id="folder_end" size="small" v-model="folderEnd" disabled />
        <label class="text-xs" for="folder_end">블로그 마무리 폴더</label>
      </FloatLabel>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const folderStart = ref();
  const folderEnd = ref();

  onMounted(async () => {
    await getData();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    folderStart.value = data.folder_start;
    folderEnd.value = data.folder_end;
  }

  const folderDialog = (event) => {
    const key = event.currentTarget.id;
    const settings = {
      key: key,
      value: null,
    }
    window.electron.ipcRenderer.send('updateSettingsFolder', settings);
  }

  window.electron.ipcRenderer.on('updateResultFolder', (event, res) => {
    if (res.key === 'folder_start') {
      folderStart.value = res.path

    } else if (res.key === 'folder_end') {
      folderEnd.value = res.path
    }
  });

</script>