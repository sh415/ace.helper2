<template>

  <div class="flex flex-col items-center justify-start h-screen">

    <div class="py-4"></div>

    <!-- 버튼 영역 -->
    <div class="py-4">
      <Button v-if="isTriggerRun"
        icon="pi pi-bolt" 
        label="프로그램 실행" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click="triggerRun"
      />
      <Button v-else
        icon="pi pi-bolt" 
        label="아직 실행할 수 없습니다." 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click=""
        disabled
      />

    </div>

    <div v-if="!isTriggerRun" class="flex py-2">
      <ProgressSpinner 
        style="width: 20px; 
        height: 20px" 
        strokeWidth="8" 
        fill="transparent" 
        animationDuration="2.5s" 
        aria-label="Custom ProgressSpinner" 
      />
      <div class="px-2 text-slate-800 font-semibold text-xs">{{ message }}</div>
    </div>

    <!-- 웹뷰 영역 -->
    <div v-if="isTriggerRun" class="flex justify-center">
      <webview 
        is="webview" 
        src="http://127.0.0.1:5816" 
        style="width: 500px; height: 400px;"
        frameborder="0"
      ></webview>
    </div>
    <div v-else></div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";

  const isTriggerRun = ref(false);
  const message = ref();
  
  onMounted (async () => {
    await getData();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    // 변수 유효성 검사
    message.value = `설정이 유효한지 검사중입니다.`;
    await waitForTimeout(1000);

    if (!data.naver_id || !data.naver_pw) {
      message.value = `네이버 계정 설정은 필수입니다.`;
      return;
    }

    if (!data.auction_id || !data.auction_pw) {
      message.value = `옥션 계정 설정은 필수입니다.`;
      return;
    }

    message.value = null;
    isTriggerRun.value = true;
  }

  const triggerRun = async () => {
    const result = await window.electron.ipcRenderer.invoke('triggerRun');
  }


  // 지연시간 추가 setTimeOut 대체
  const waitForTimeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

</script>