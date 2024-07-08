import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userstore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: true,
  changeChat: (chatId, user) => {
    let receiverId = null;
    if (user && user.receiverId) {
      receiverId = user.receiverId;
      console.log('Receiver ID:', receiverId); 
    } else {
      console.log('Receiver ID is undefined.fdv');
    }
    
    const currentUser = useUserStore.getState().currentUser;

    if (user.blocked) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }
   
   else if (currentUser.blocked) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else{
      return set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
    }
   
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
}));
