function uid(){
let timmy = Date.now().toString(36).toLocaleUpperCase();
let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
return ''.concat(timmy, '-', randy);
}

src="https://cdn.jsdelivr.net/npm/idb@3.0.2/build/idb.min.js"

const IDB = (function init() {
    let db = null;
    let objectStore = null;
    let DBOpenReq = indexedDB.open('WorkTime', 7);

    DBOpenReq.addEventListener('error', (err)=>{
        console.warn(err);
    });

    DBOpenReq.addEventListener('success', (e)=>{
        db = e.target.result;
        db.onversionchange = function() {
            db.close();
            alert("Database is outdated, please reload the page.")
          };
        console.log('success', db);
    });

    DBOpenReq.addEventListener('upgradeneeded', (e)=>{
        db = e.target.result;
        console.log('upgrade', db);
        if(! db.objectStoreNames.contains('workStore')){
            objectStore = db.createObjectStore('workStore', {
                keyPath: 'id',
            });
        }
        if(db.objectStoreNames.contains('store')){
            db.deleteObjectStore('store');
        }
    });

    let reqid = (document.URL.toString().substring(window.location.toString().indexOf("?") + 1));

    let path = window.location.pathname;
    let page = path.split("/").pop();
    
    if(window.location.toString().includes("update.html")){
        
        let flag = 0;
        if(flag === 0){    
            init();
            
                    async function init() {
                        
                        db = await idb.openDb('WorkTime', 7, db => {
                            db.createObjectStore('workStore', { keyPath: 'id' });
                            
                        });
                        list();
                    }

                    async function list() {
                        let tx = db.transaction('workStore');
                        let store = tx.objectStore('workStore');

                        let works = await store.get(reqid);
                        document.getElementById('name').value = works.name;
                        document.getElementById('date').value = works.date;
                        document.getElementById('timefrom').value = works.timefrom;
                        document.getElementById('timeto').value = works.timeto;
                        document.getElementById('tag').value = works.tag;
                        document.storeForm.setAttribute('data-key', works.reqid);
                    };
                    flag = 1;
        };
        if(flag === 1){
            document.getElementById('btnUpdate').addEventListener('click', (e) => {
                e.preventDefault();
            
                let name = document.getElementById('name').value.trim();
                let date = document.getElementById('date').value;
                let timefrom = document.getElementById('timefrom').value;
                let timeto = document.getElementById('timeto').value;
                let tag = document.getElementById('tag').value;
                
                    let work = {
                        id: reqid,
                       name,
                       date,
                       timefrom,
                       timeto,
                       tag
                    };
                    
                    let tx = makeTX('workStore', 'readwrite');
                    
            
                  let store = tx.objectStore('workStore');
                  let request = store.put(work);
                  clearForm();
                  
                  request.onsuccess = (e) => {
                    console.log('Successfully added an object')
                };
                request.onerror = (err) => {
                    console.log('Error in request to add');
                };
                flag=0;
              window.open("./list.html", '_self');
            });
              
            }
    }    

if(window.location.toString().includes("delete.html")){
        
    let flag = 0;
        if(flag === 0){    
            init();
            
                    async function init() {
                        
                        db = await idb.openDb('WorkTime', 7, db => {
                            db.createObjectStore('workStore', { keyPath: 'id' });
                            
                        });
                        list();
                    }

                    async function list() {
                        let tx = db.transaction('workStore');
                        let store = tx.objectStore('workStore');

                        let works = await store.get(reqid);
                        document.getElementById('name').value = works.name;
                        document.getElementById('date').value = works.date;
                        document.getElementById('timefrom').value = works.timefrom;
                        document.getElementById('timeto').value = works.timeto;
                        document.getElementById('tag').value = works.tag;
                        
                    };
                    flag = 1;
        };

        if(flag === 1){
            document.getElementById('btnDelete').addEventListener('click', (e) => {
                e.preventDefault();
            
                let key = reqid;
    
      let tx = makeTX('workStore', 'readwrite');
      let store = tx.objectStore('workStore');
      let request = store.delete(key); 

      request.onsuccess = (ev) => {
        console.log('successfully deleted an object');
      };
      request.onerror = (err) => {
        console.log('error in request to delete');
      };

                flag=0;
              window.open("./list.html", '_self');
            });
              
            }
};

    if(page === "" || page === "index.html"){
    document.getElementById('btnAdd').addEventListener('click', (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value.trim();
        let date = document.getElementById('date').value.trim();
        let timefrom = document.getElementById('timefrom').value;
        let timeto = document.getElementById('timeto').value;
        let tag = document.getElementById('tag').value;
        let work = {
             id: uid(),
            name,
            date,
            timefrom,
            timeto,
            tag
        };

        let tx = makeTX('workStore', 'readwrite');
        tx.oncomplete = (e) => {
            console.log(e);
            clearForm();
        };

        let store = tx.objectStore('workStore');
        let request = store.add(work);

        request.onsuccess = (e) => {
            console.log('Successfully added an object')
        };
        request.onerror = (err) => {
            console.log('Error in request to add');
        };
        window.open("./list.html", '_self');
    });
    }

    function makeTX(storeName, mode){
        let tx = db.transaction(storeName, mode);
        tx.onerror = (err) => {
            console.warn(err);
        };
        return tx;
    }

    document.getElementById('btnCancel').addEventListener('click', clearForm);
    
    function clearForm(e){
        if(e) e.preventDefault();
        document.storeForm.reset();
        if(window.location.toString().includes("delete.html")){
            window.open("./list.html", '_self');
        }
    }
})();