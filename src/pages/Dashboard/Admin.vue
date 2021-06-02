<template>
  <div>
    <h2>Liste des collaborateurs à alerter</h2>
    <b-card title="Ajouter ou supprimer un collaborateur dans la liste">
      <l-radio v-model="actionCollaboratorList" label="addCollab" >Ajouter</l-radio>
      <l-radio v-model="actionCollaboratorList" label="deleteCollab" >Supprimer</l-radio>

        <div class="row" v-if="actionCollaboratorList == 'addCollab' || actionCollaboratorList == 'deleteCollab'">
          <div class="col-lg-4" align="center">
              <label for="name">Nom</label>
              <br>
              <input id="name" v-model="name" type="text" name="name"></input>
          </div>
          <div class="col-lg-4" align="center">
              <label for="firstName">Prénom</label>
               <br>
              <input id="firstName" v-model="firstName" type="text" name="firstName"></input>
          </div>
          <div class="col-lg-4" align="center">
              <label for="number">Numéro de téléphone</label>
               <br>
              <input id="number" v-model="number" type="text" name="number" ></input>
          </div>
        </div>
        <br>
        <div align="center" v-if="actionCollaboratorList == 'addCollab' ">
          <l-button type="info" @click="addToJsonCollaborator()" > Enregistrer </l-button>
          <p v-if="saveErrorMessage != null"> {{this.saveErrorMessage}}</p>
        </div>
      <div align="center" v-if="actionCollaboratorList == 'deleteCollab' ">
        <l-button type="info" @click="deleteFromJsonCollaborator()" > Supprimer </l-button>
        <p v-if="deleteErrorMessage != null"> {{this.saveErrorMessage}}</p>
      </div >
      <div>
        <p align="center" style="color: red">{{this.errors[3]}}</p>
      </div>

      <div>
        <h3>Liste des collaborateurs</h3>
        <div class="col-lg-5" align="left">
        <table class="table table-striped" >
          <thead class="thead-light">
            <tr>
              <th scope="col"> ID </th>
              <th scope="col"> Nom </th>
              <th scope="col"> Prénom </th>
              <th scope="col"> Numéro </th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="collaborator in collaboratorList.filter(s => s.project === this.$PROJECT )">
            <th scope="row">{{ collaborator.ID }}</th>
            <td> {{collaborator.name}}</td>
            <td> {{collaborator.firstName}}</td>
            <td> {{collaborator.number}}</td>
          </tr>
          </tbody>
        </table>

        </div>
      </div>
    </b-card>


    <h2>Capteurs de hauteur de neige</h2>
    <b-card title="Modifier la hauteur d'installation">
      <div class="row">
        <div class="col-lg-6" align="center" >
          <h4>Emplacement</h4>
        </div>
        <div class="col-lg-6" align="center" >
          <h4>Hauteur d'installation [mm]</h4>
        </div>
      </div>
      <div class="row" v-for="project in this.snowOffsetList.filter(s => s.project === this.$PROJECT) ">
        <div class="col-lg-6" align="center" >
          <p style="color: darkgrey" >{{project.realName}}</p>
        </div>
        <div class="col-lg-6" align="center" >
          <input :id="'snowOffset-'+project.location" type="number" name="snowOffset" :value="project.offset"></input>
        </div>

      </div>
      <div align="center">
        <l-button type="info" @click="updateSnowOffset(proj)"> Valider </l-button>
      </div>
    </b-card>
  </div>

</template>

<script>

import LCheckbox from "@/components/Inputs/Checkbox";
import LRadio from "@/components/Inputs/Radio";
import axios from "axios"

export default {
  components: {LRadio, LCheckbox},

  data () {
    return {
      proj : location.hostname.split('.')[0],
      errors: [],

      collaboratorList : [],
      ID: '',
      name : '',
      firstName: '',
      number : '',
      actionCollaboratorList : false,
      saveErrorMessage : null,
      deleteErrorMessage :null,
      selectedFile: "",

      snowOffsetList : [],
      snowOffset : '',

    }

  },
  created() {

    /**
     * download file from server
     */
    axios.get(this.$SERVERURL + 'collaboratorList')
      .then(res => {

        this.collaboratorList = res.data;
        console.log(this.collaboratorList)
      })
      .catch(error => {
        console.log(error)
        // Manage errors if found any
      })

    axios.get(this.$SERVERURL + 'snowOffset')
      .then(res => {
        this.snowOffsetList = res.data;
        //console.log(this.snowOffsetList)
      })
      .catch(error => {
        console.log(error)
        // Manage errors if found any
      })

  },
  methods: {
   /**
     * Add a collaborator to the Json document server side
     */
    addToJsonCollaborator : function (){
      this.errors = [];
      if(this.name === '' || this.firstName === '' || this.number === ''){
        console.log("Informations du collaborateur incomplètes")
        this.errors[3] = "Informations du collaborateur incomplètes";
      }else{
        this.collaboratorList.push({ID : this.collaboratorList.length, name : this.name, firstName : this.firstName, number : this.number, project : this.$PROJECT})
        //add collaborator to json
        const formData = new FormData();
        formData.append("file", new Blob([
          JSON.stringify(this.collaboratorList),

        ], {type : 'application/json'}), "collabList.json");  // appending file
        // sending file to the backend
        axios.post('https://snow-server.watermon.ch:443/collaboratorList', formData)
          .then(res => {
            //console.log("write from webstorm");
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },


    /**
     *
     */
    deleteFromJsonCollaborator : function(){
      this.collaboratorList.forEach(element => {
          if (element.ID === this.ID) {
            this.collaboratorList.splice(this.collaboratorList.indexOf(element), 1)
          } else if (element.name === this.name) {
            if (element.firstName === this.firstName) {
              this.collaboratorList.splice(this.collaboratorList.indexOf(element), 1)
            }
          }
        }
      )
      //rewrite on the document
      const formData = new FormData();
      formData.append("file", new Blob([
        JSON.stringify(this.collaboratorList),

      ], {type : 'application/json'}), "collabList.json");  // appending file
      // sending file to the backend
      axios.post(this.$SERVERURL + 'collaboratorList', formData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err)
        });

    },

    updateSnowOffset :function (proj){
      for(var i = 0 ; i<this.snowOffsetList.length; i++){
        if(this.snowOffsetList[i].project === proj){
          this.snowOffsetList[i].offset = document.getElementById('snowOffset-'+this.snowOffsetList[i].location).value
          console.log(this.snowOffsetList[i].offset)
        }
      }
     // console.log(this.snowOffsetList)

      //add collaborator to json
      const formData = new FormData();
      formData.append("file", new Blob([
        JSON.stringify(this.snowOffsetList),

      ], {type : 'application/json'}), "snowOffsetList.json");  // appending file
      // sending file to the backend
    //  console.log(this.snowOffsetList)
      axios.post(this.$SERVERURL + 'snowOffset', formData)
        .then(res => {
         // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },


    toto : function (){
      axios.get(this.$SERVERURL + 'sensorList')
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error)
        })


    }
  }
}
</script>
<style>
.login{
  text-align:center;
  width: 50%;
  margin: auto;
}
.admin{

}

</style>
