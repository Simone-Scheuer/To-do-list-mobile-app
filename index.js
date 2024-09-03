import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://leads-tracker-app-a5622-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

function render(leads) {
    let listItems = "";
    for (let key in leads) {
        let lead = leads[key];
        listItems += `
            <li data-id="${key}">
                ${lead.text} <input class="checkbox" type="checkbox" checked>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

ulEl.addEventListener('change', function(event) {
    if (event.target.classList.contains('checkbox')) {
        const li = event.target.closest('li');
        const id = li.dataset.id;
        const checked = event.target.checked;

        // Update checkbox state in Firebase
        const itemRef = ref(database, `leads/${id}`);
        itemRef.update({ checked: checked });
    }
});

onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists()
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val()
        const leads = Object.values(snapshotValues)
        render(leads)
    }
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    const newItem = {
        text: inputEl.value,
        checked: false
    };
    push(referenceInDB, newItem);
    inputEl.value = "";
})
