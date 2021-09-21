class View {
    constructor() {
        this.app =  document.getElementById("app");
       
        this.title = this.createElement("h1","title");
        this.title.textContent = "GithubAPI Search Repositories";
        
        this.searchLine = this.createElement("div","search-line");
        this.searchInput = this.createElement("input","search-input");
        this.searchCounter = this.createElement("span","counter");
        this.selectedList = this.createElement("ul","selected-list");
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.searchCounter);
       // this.searchWrapper = this.createElement("ul","search-wrapper");

        this.reposWrapper = this.createElement("div","repos-wrapper");
        this.reposList = this.createElement("ul","repos-list");
        this.reposWrapper.append(this.reposList);
        this.reposWrapper.append(this.selectedList)
        
        this.main = this.createElement("div","main");
        this.main.append(this.reposWrapper)

        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.main)

        this.arrayOfbtns = [];
    }

    createElement(el,elClass) {
        const element = document.createElement(el);
        if (elClass) {
         element.classList.add(elClass)
        }
        return element;
    }

    createRepos(reposData) {
        const reposElement = this.createElement("li","repository")
        reposElement.innerHTML = `<span class="repos-name">${reposData.name}</span><br>`;    
        reposElement.addEventListener("click", this.addRepos.bind(this, reposData))  
        this.reposList.append(reposElement);         
    }

    addRepos(reposData) {
        const reposElement = this.createElement("li","repositories-selected");
        let count = document.getElementsByClassName('repositories-selected').length + 1;
        reposElement.innerHTML = `<div>
                                    <span class="repos-name-selected">Name: ${reposData.name}</span><br>
                                    <span class="repos-name-selected">Owner: ${reposData.owner.login}</span><br>
                                    <span class="repos-name-selected">Stars: ${reposData.stargazers_count}</span>
                                  </div>
                                  <div  class="repos-delete" id="repos-delete-${count}"></div>`;
        this.selectedList.append(reposElement); 
        const deleteButton = document.getElementById(`repos-delete-${count}`);
        const parentToDelete = deleteButton.parentNode;
        parentToDelete.addEventListener("click", function() {
            parentToDelete.classList.add("hide");
        })
    }
}

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchInput.addEventListener("keyup",debounce(this.searchRepos.bind(this), 300));
    }

    async searchRepos() {
        await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}`).then(res => {
            if (res.ok) {
              res.json().then(res => {
                console.log(res);
                //console.log(this.view.reposList.innerHTML);
                if(this.view.reposList.hasChildNodes()) {
                    this.view.reposList.innerHTML = "";
                }
                for (let i = 0; i < 5; i++) {
                    this.view.createRepos(res.items[i]);     
                }
              })
            }
            else {
              this.view.reposList.innerHTML = "";
            }
        })
    }


}

const debounce = (fn, ms) => {
    let timeout;
    return function () {
      const fnCall = () => fn.apply(this, arguments)
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms)
    };
  }

const search = new Search(new View());

// let deleteButtons = document.getElementsByClassName("repos-delete");
// console.log(deleteButtons);
// if (deleteButtons.length != 0) {
//     deleteButtons.forEach(i => {
//         i.addEventListener("click", function() {
//             let elToDelete =  i.parentNode;
//             console.log(elToDelete)
//             liToDelete.parentNode.removeChild(elToDelete);
//         })
//     });
// } 


