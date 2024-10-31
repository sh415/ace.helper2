<template>
  <div>

    <div class="py-4"></div>

    <!-- 버튼 영역 -->
    <div class="py-4 flex justify-center">
      <Button v-if="isTriggerRun === true"
        icon="pi pi-bolt" 
        label="프로그램 실행" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click="triggerStart"
      />
      <Button v-else
        icon="pi pi-bolt" 
        label="프로그램 실행중" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click=""
        disabled
      />

    </div>

    <div class="flex py-2">
      <div>
        <ProgressSpinner v-if="!isTriggerRun"
        style="width: 20px; 
        height: 20px" 
        strokeWidth="8" 
        fill="transparent" 
        animationDuration="2.5s" 
        aria-label="Custom ProgressSpinner" 
      />
      </div>
      <div class="px-2 text-slate-800 font-semibold text-xs">{{ message }}</div>
    </div>

    <!-- 웹뷰 영역 -->
    <div v-if="connection" class="flex justify-center">
      <!-- <webview 
        is="webview" 
        src="http://127.0.0.1:5816" 
        style="width: 500px; height: 400px;"
        frameborder="0"
      ></webview> -->
    </div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";

  const isTriggerRun = ref(false);
  const isTriggerLock = ref(false);
  const message = ref();
  const connection = ref(false);
  
  onMounted (async () => {
    await getData();

    // 이후 주기적으로 실행 현황 체크
    setInterval(async () => {
      console.log('setInterval() -> triggerMessage()')
      await triggerMessage();
        
    }, 1000);
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);

    // 1. 변수 유효성 검사
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

    // 2. fastApi 서버 연결 검사
    const result = await checkConnection();
    if (result) {
      connection.value = true;
      message.value = `프로그램이 연결되었습니다.`;

    } else {
      message.value = `프로그램이 연결되지 않았습니다. 프로그램을 시작합니다.`;
      await waitForTimeout(1000);
      await triggerServer();
    }

    // 3. 실행중인 작업 존재 여부 검사
    if (connection) {
      message.value = `진행중인 작업이 있는지 확인중.`;
      await waitForTimeout(1000);
      await triggerMessage();
    }
  }

  const checkConnection = async () => {
    try {
      message.value = `프로그램 연결 확인중.`;
      await waitForTimeout(1000);

      const result = await window.electron.ipcRenderer.invoke('checkConnection');  
      return result;
      
    } catch (error) {
      console.log(error);
    }
  }

  const triggerServer = async () => {
    message.value = `프로그램 실행중.`;
    const result = await window.electron.ipcRenderer.invoke('triggerServer');
    console.log(result);
    if (result.result) {
      connection.value = true;
      message.value = `프로그램 실행 가능합니다.`;

    } else {
      connection.value = false;
      message.value = result.message;
    }
  }

  const triggerMessage = async () => {
    const result = await window.electron.ipcRenderer.invoke('triggerMessage');

    if (!result.status) {
      message.value = `진행중인 작업이 없습니다.`;
      isTriggerRun.value = true;

    } else {
      isTriggerRun.value = false;
      message.value = result.message;

      console.log(result)

    }
  }

  const triggerStart = async () => {
    isTriggerRun.value = false;
    await window.electron.ipcRenderer.invoke('triggerStart');
  }


  // 지연시간 추가 setTimeOut 대체
  const waitForTimeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

</script>