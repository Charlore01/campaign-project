<template>
  <div class="modal-overlay animate__animated animate__zoomIn animate__slow" v-if="isVisible">
    <div class="modal-content">
      <h3>Stop Campaign</h3>
      <div></div>
      <p>Are you sure you want to delete  {{ campaignName }}  campaign?</p>
      <p> This action cannot be undone.</p>
      <div class="modal-actions">
        <button class="btn cancel-btn" @click="closeModal">Cancel</button>
        <button class="btn delete-btn" @click="confirmStop">Delete Campaign</button>
      </div>
    </div>
  </div>
</template>

<script>
import Campaign from '@/views/campaign.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close');
    };

    const confirmStop = () => {
      emit('confirm');
    };

    return {
      closeModal,
      confirmStop
    };
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 15px;
}

.cancel-btn {
  border: 1px solid #990000;
  color: #990000;
}

.delete-btn {
  background-color: #990000;
  color: #fff;
}

.delete-btn:hover {
  background-color: #660000;
  color: #fff;
}


.cancel-btn:hover {
  border: 1px solid #990000;
  background-color: #990000;
  color: #fff;
}
</style>
