<template>
  <div class="card flex justify-center">
    <Menu class="text-xs" :model="items" />
  </div>
</template>
  
<script setup>
  import { ref, onMounted } from "vue";

  // emit 정의
  const emit = defineEmits(['close']);

  const items = ref([
    {
      label: 'Settings',
      items: [
        {
          label: '네이버 계정 설정',
          icon: 'pi pi-user'
        },
        {
          label: '옥션 계정 설정',
          icon: 'pi pi-user'
        },
        {
          label: '이미지 폴더',
          icon: 'pi pi-folder-open'
        },
        {
          label: 'OpenAI 옵션',
          icon: 'pi pi-cog'
        },
      ]
    },
    {
      label: 'Menus',
      items: [
        {
          label: '실행',
          icon: 'pi pi-bolt'
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

</script>

<style scoped>
</style>