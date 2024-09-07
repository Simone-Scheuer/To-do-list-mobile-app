import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove,
         update,
        } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

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
                ${lead.text} <input class="checkbox" type="checkbox" ${lead.checked ? 'checked' : ''}>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}


ulEl.addEventListener('change', function(event) {
    if (event.target.classList.contains('checkbox')) {

        const li = event.target.closest('li');  // Get the closest <li> element
        console.log("Closest li:", li);  // Debug log for <li>
        const id = li.dataset.id;
        console.log("Data ID:", id);  // Debug log for dataset.id
        const checked = event.target.checked;
        console.log("Checked status:", checked);

        //const li = event.target.closest('li');
        //console.log(li,li.dataset)
        //const id = li.dataset.id;
        // const checked = event.target.checked;
        // console.log("change logged",checked)
        // Update checkbox state in Firebase

        const itemRef = ref(database, `leads/${id}`);
        console.log(itemRef)
        update(itemRef, { checked: checked });
    }
});

onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists();
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val();
        render(snapshotValues);  // Pass the full object, not just values
    }
});


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
