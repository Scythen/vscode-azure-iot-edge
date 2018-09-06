const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        searchInput: '',
        selectedModule: {},
        selectedTag: "",
        moduleName: '',
        modules: [],
        endpoint: document.getElementById('app').getAttribute('data-endpoint').includes("{{") ? "http://localhost:63488" : document.getElementById('app').getAttribute('data-endpoint')
    },
    created: async function () {
        this.modules = await this.getModules();
    },
    methods: {
        getModules: async function () {
            return (await axios.get(`${this.endpoint}/api/v1/modules`)).data.items;
        },
        getModuleMetadata: async function (module) {
            return (await axios.get(`${this.endpoint}/api/v1/modules/${module.id}?uri=${encodeURIComponent(module.metaUri)}`)).data;
        },
        showModule: async function (module) {
            // this.selectedModule.id = '';
            const metadata = await this.getModuleMetadata(module);
            this.selectedModule = Object.assign({}, module);
            this.selectedModule.metadata = metadata;
            this.selectedTag = this.selectedModule.metadata.tagsOrDigests[0];
        },
        importModule: function () {
            alert(this.moduleName + " ~ " + this.selectedModule.metadata.containerUri + " ~ " + this.selectedTag);
        }
    },
    computed: {
        filteredModules: function () {
            return this.modules.filter(module => {
                return module.name.toLowerCase().includes(this.searchInput.toLowerCase());
            });
        }
    }
});

const vscode = acquireVsCodeApi();

async function getData(type, data) {

    data.type = type;
    vscode.postMessage(data);
    return new Promise((resolve) => {
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            resolve(event);
        });
    })
}

async function f2() {
    let data = await getData('aa', {
        'aa': 1
    });
    console.log(111)
    console.log(data);
    let data2 = await getData('bb', {
        'vv': 1
    });
    console.log(data2);
    console.log(222)
}
f2();