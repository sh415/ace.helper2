<template>
  <div>

    <div class="py-4"></div>

    <!-- 버튼 영역 -->
    <div class="py-4 flex justify-center">
      <Button v-if="!isTroubleShooting"
        icon="pi pi-wrench" 
        label="문제 해결" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click="troubleShooting"
      />
      <Button v-else
        icon="pi pi-wrench" 
        label="문제 해결" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click=""
        disabled
      />

    </div>

    <div class="flex py-2">
      <div class="px-2 text-slate-800 font-semibold text-xs">{{ message }}</div>
    </div>

  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";

  const isTroubleShooting = ref(false);
  const message = ref('실행에 문제가 있으면 이 버튼을 클릭하세요.');
  
  onMounted (async () => {
  })

  const troubleShooting = async () => {
    message.value = '문제 해결 중.';
    isTroubleShooting.value = true;
    await window.electron.ipcRenderer.invoke('troubleShooting');
    await waitForTimeout(3000);

    message.value = '문제를 해결하였습니다.';
    isTroubleShooting.value = false;
  }

  // 지연시간 추가 setTimeOut 대체
  const waitForTimeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

</script>