// メモを管理するクラス
class MemoManager {
    constructor() {
        this.memos = JSON.parse(localStorage.getItem("memos")) || [];
        this.memoText = document.getElementById("memo-text");
        this.memoList = document.getElementById("memo-list");
        this.saveButton = document.getElementById("save-memo");

        this.saveButton.addEventListener("click", () => this.saveMemo());
        this.loadMemos();
    }

    // メモを保存
    saveMemo() {
        const text = this.memoText.value.trim();
        if (!text) return;

        const memo = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toLocaleString(),
        };

        this.memos.unshift(memo);
        this.saveToLocalStorage();
        this.memoText.value = "";
        this.loadMemos();
    }

    // メモを編集
    editMemo(id) {
        const memoItem = document.getElementById(`memo-${id}`);
        const memoContent = memoItem.querySelector(".memo-content");
        const currentText = this.memos.find((memo) => memo.id === id).text;

        memoItem.classList.add("editing");
        const textarea = document.createElement("textarea");
        textarea.value = currentText;
        memoContent.innerHTML = "";
        memoContent.appendChild(textarea);

        const saveEditBtn = document.createElement("button");
        saveEditBtn.className = "btn";
        saveEditBtn.textContent = "保存";
        memoContent.appendChild(saveEditBtn);

        saveEditBtn.addEventListener("click", () => {
            const newText = textarea.value.trim();
            if (!newText) return;

            const index = this.memos.findIndex((memo) => memo.id === id);
            if (index !== -1) {
                this.memos[index].text = newText;
                this.saveToLocalStorage();
                this.loadMemos();
            }
        });
    }

    // メモを削除
    deleteMemo(id) {
        if (confirm("このメモを削除してもよろしいですか？")) {
            this.memos = this.memos.filter((memo) => memo.id !== id);
            this.saveToLocalStorage();
            this.loadMemos();
        }
    }

    // メモをローカルストレージに保存
    saveToLocalStorage() {
        localStorage.setItem("memos", JSON.stringify(this.memos));
    }

    // メモを画面に表示
    loadMemos() {
        this.memoList.innerHTML = "";
        this.memos.forEach((memo) => {
            const memoItem = document.createElement("div");
            memoItem.className = "memo-item";
            memoItem.id = `memo-${memo.id}`;

            const memoContent = document.createElement("div");
            memoContent.className = "memo-content";
            memoContent.textContent = memo.text;

            const memoActions = document.createElement("div");
            memoActions.className = "memo-actions";

            const editButton = document.createElement("button");
            editButton.className = "action-btn edit-btn";
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener("click", () => this.editMemo(memo.id));

            const deleteButton = document.createElement("button");
            deleteButton.className = "action-btn delete-btn";
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener("click", () => this.deleteMemo(memo.id));

            memoActions.appendChild(editButton);
            memoActions.appendChild(deleteButton);
            memoItem.appendChild(memoContent);
            memoItem.appendChild(memoActions);
            this.memoList.appendChild(memoItem);
        });
    }
}

// アプリの初期化
document.addEventListener("DOMContentLoaded", () => {
    new MemoManager();
});
