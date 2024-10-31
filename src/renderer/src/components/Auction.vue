<template>
  <div class="card flex justify-center">
    <Menu class="text-xs" :model="items" />
  </div>

  <div class="flex-grow flex justify-center items-center">
    <div v-if="menu === 0">
      <SettingsNaver />
    </div>
    <div v-else-if="menu === 1">
      <SettingsAuction />
    </div>
    <div v-else-if="menu === 2">
      <SettingsFolder />
    </div>
    <div v-else-if="menu === 3">
      <SettingsOpenAI />
    </div>
    <div v-else-if="menu === 4">
      <SettingsPost />
    </div>
    <div v-else-if="menu === 5">
      <MenusRun />
    </div>
    <div v-else-if="menu === 6">
      <TroubleShooting />
    </div>
  </div>

  <Toast />

</template>
  
<script setup>
  import { ref, onMounted } from "vue";
  import { useToast } from 'primevue/usetoast';
  import SettingsNaver from "./SettingsNaver.vue";
  import SettingsAuction from "./SettingsAuction.vue";
  import SettingsFolder from "./SettingsFolder.vue";
  import SettingsOpenAI from "./SettingsOpenAI.vue";
  import SettingsPost from "./SettingsPost.vue";
  import MenusRun from "./MenusRun.vue";
  import TroubleShooting from "./TroubleShooting.vue";

  const toast = useToast();

  // emit 정의
  const emit = defineEmits(['close']);

  const menu = ref(0);
  const items = ref([
    {
      label: 'Settings',
      items: [
        {
          label: '네이버 계정 설정',
          icon: 'pi pi-user',
          command: () => {
            menu.value = 0;
          }
        },
        {
          label: '옥션 계정 설정',
          icon: 'pi pi-user',
          command: () => {
            menu.value = 1;
          }
        },
        {
          label: '이미지 폴더',
          icon: 'pi pi-folder-open',
          command: () => {
            menu.value = 2;
          }
        },
        {
          label: 'OpenAI 설정',
          icon: 'pi pi-cog',
          command: () => {
            menu.value = 3;
          }
        },
        {
          label: '포스팅 설정',
          icon: 'pi pi-cog',
          command: () => {
            menu.value = 4;
          }
        },
      ]
    },
    {
      label: 'Menus',
      items: [
        {
          label: '실행',
          icon: 'pi pi-bolt',
          command: () => {
            menu.value = 5;
          }
        },
        {
          label: '문제 해결',
          icon: 'pi pi-wrench',
          command: () => {
            menu.value = 6;
          }
        },
        {
          label: '나가기',
          icon: 'pi pi-sign-out',
          command: () => {
            emit('close');
          }
        }
      ]
    },
  ]);

  window.electron.ipcRenderer.on('updateResult', async (event, res) => {
    const message = `${res} 수정했습니다.`;
    toast.add({ severity: 'info', summary: '수정됨', detail: message, life: 3000 });
  });

</script>

<style scoped>
</style>