<template>
    <v-content class="contents">
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" >
                    <v-card
                        class="pa-2"
                        outlined
                        tile
                    >
					<v-icon class="mx-4" style="color:#fddca9; font-size:18px;" >  mdi-arrange-send-backward </v-icon>
					<span class="font-weight-bold" style="color:#fddca9; font-size:15px;" >정비 참고 매뉴얼</span>
                    </v-card>
                </v-col>
            </v-row>  			
            <v-row>
                <v-col cols="12" sm="3" >
					<v-card>
							<v-select
								class="pa-4 pb-0 pt-6 adjustSelect"
								v-model="mainGroupId"
								:items="mainGroupLists"
								item-text="MainGroupName"
								item-value="MainGroupId"								
								label="Main 그룹"
								outlined
								dense
								@change="changeMainGroup"
								>
							</v-select>
					</v-card>
                </v-col>
                <v-col cols="12" sm="3" >
					<v-card>
							<v-select
								class="pa-4 pb-0 pt-6 adjustSelect"
								v-model="subGroupId"
								:items="subGroupLists"
								item-text="SubGroupName"
								item-value="SubGroupId"	
								label="Sub 그룹"
								outlined
								dense
								@change="changeSubGroup"
								>
							</v-select>
					</v-card>
                </v-col>
                <v-col cols="12" sm="3" >
					<v-card>
							<v-select
								class="pa-4 pb-0 pt-6 adjustSelect"
								v-model="itemMpId"
								:items="itemMpLists"
								item-text="ItemMpText"
								item-value="ItemMpId"	
								label="상세 항목"
								outlined
								dense
								@change="changeItemMp"
								>
							</v-select>
					</v-card>
                </v-col>
                <v-col cols="12" sm="3" >
					<v-card>
							<v-select
								class="pa-4 pb-0 pt-6 adjustSelect"
								v-model="manualId"
								:items="qualColLists"
								item-text="QualColText"
								item-value="ManualId"	
								label="매뉴얼 구분"
								outlined
								dense
								@change="changeManualId"
								>
							</v-select>
							<v-btn id='btnFuncTranslateDelegate' @click="clickPopup" style="display:none;">JSTranslateDelegate</v-btn>
					</v-card>
                </v-col>					
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                    sm="12"
                >
                    <v-card
                        class="pa-2"
                        outlined
                        tile
						id = "RMIContents"
                    >
                    </v-card>
                </v-col>
            </v-row>            
        </v-container>
		<BackToTop></BackToTop>
		<v-dialog
			v-model="showTranslateMessage"
			width="500"
		>
			<v-card>
				<v-card-title
					class="headline deep-orange accent-2"
					primary-title
				>
					문장 번역
				</v-card-title>

				<v-card-text class="pt-4" id = "RMITranslate"></v-card-text>
				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="deep-orange accent-2"
						text
						@click="showTranslateMessage = false"
					>
						확인
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>		
    </v-content>
</template>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
	import Constant from '@/Constant';
	import BackToTop from '@/components/Common/BackToTop.vue'
	const axios = require('axios').default;
	const url = "https://rmi-services.tecalliance.net/rest/Manuals";
		
	export default {
		name: 'RMI-MANUALS',
		data(){
			return{
				mainGroupLists: [],
				subGroupLists: [],
				itemMpLists: [],
				qualColLists: [],
				mainGroupId: '',
				subGroupId: '',
				itemMpId: '',
				manualId: '',
				rmiAuthKey: '',	
				carTypeId: '',
				translateMessage: '',
				showTranslateMessage: false,
			}
		},
		components: {
			BackToTop
		},
		created () {
			this.$EventBus.$on('RMI-MANUALS.InitData', param => {  
				this.rmiAuthKey = param.rmiAuthKey;
				this.carTypeId = param.carTypeId; 
				this.initAuthKey();
				this.setMainGroup();
			});

			document.addEventListener('mousedown', function(){
				this.translateMessage = '';
				if ((event.button == 2) || (event.which == 3)) {
					event.preventDefault();
					console.log('우클릭 : ', document.getSelection().toString());
					if(document.getSelection().toString().length > 0) {
						
						var param = {};
						param.text = document.getSelection().toString();

						axios({
							method: 'POST',
							url: Constant.TRANSLATE_URL,
							data: param
						})
						.then((result) => {
							console.log('result : ', result);
							document.getElementById('btnFuncTranslateDelegate').value = result.data[0];
							document.getElementById('btnFuncTranslateDelegate').click();
						});
					}
				}
			});
		},	
		methods: {
			initAuthKey() {
				let url = 'https://rmi-services.tecalliance.net/auth/login';
				let params = {
					Company: 'SK Network-South Korea_3303624',
					Account: 'rmi-ws_004553-1-KR',
					Password: 'SkCho123!'
				};

				// Send HTTP request
				let xmlHttp = new XMLHttpRequest();
				xmlHttp.open( 'POST', url, false );
				xmlHttp.setRequestHeader( 'Content-type', 'application/json;charset=UTF-8' );
				xmlHttp.setRequestHeader( 'Accept', 'application/json' );
				xmlHttp.send( JSON.stringify( params ) );

				// Handle HTTP response
				if(xmlHttp.status == 200) {
					this.rmiAuthKey = 'TecRMI ' + xmlHttp.getResponseHeader( 'X-AuthToken' );
				}
			},
			async translateText(text) {

				let [translations] = await translate.translate(text, "ko");
				translations = Array.isArray(translations) ? translations : [translations];
				console.log('Translations:');
				translations.forEach((translation, i) => {
					console.log(`${text[i]} => (${target}) ${translation}`);
				});
			},
			setMainGroup() {
				this.mainGroupLists = [];
				this.subGroupLists = [];
				this.itemMpLists = [];
				this.qualColLists = [];

				this.mainGroupId = '';
				this.subGroupId = '';
				this.itemMpId = '';
				this.manualId = '';

				$("#RMIContents").html('');

				if(this.carTypeId !== undefined && this.carTypeId !== '' ) {
					
					let languageCode = 'en',
						countryCode = 'kr',
						typeId = this.carTypeId;		
						
					// Build url query string
					let query = '?languageCode=' + languageCode
						+ '&countryCode=' + countryCode
						+ '&typeId=' + typeId	
					
					// Send HTTP request
					let xmlHttp = new XMLHttpRequest();
					xmlHttp.open( 'GET', url + '/ManualList' + query, false );
					xmlHttp.setRequestHeader( 'Content-type', 'application/json;charset=UTF-8' );
					xmlHttp.setRequestHeader( 'Accept', 'application/json' );
					xmlHttp.setRequestHeader( 'Authorization', this.rmiAuthKey );
					xmlHttp.send( null );
					
					// Handle HTTP response
					if(xmlHttp.status == 200) {
						console.log('changeMainGroup 리턴 : ', JSON.parse(xmlHttp.responseText));

						/////////////////////////////////////
						/*
						this.mainGroupId = 119;
						this.$nextTick(function(){
							this.changeMainGroup();
							this.subGroupId = 477;
							this.$nextTick(function(){
								this.changeSubGroup();
								this.itemMpId = 15002;
								this.$nextTick(function(){
									this.changeItemMp();
									this.manualId = 114736;
									this.$nextTick(function(){
										this.changeManualId();
									});
								});
							});
						});*/
						/////////////////////////////////////

						this.mainGroupLists = JSON.parse(xmlHttp.responseText);
					}

				}       
			},
			changeMainGroup() {
				var selected = this.mainGroupId;
				this.itemMpLists = [];
				this.qualColLists = [];

				this.itemMpId = '';
				this.manualId = '';

				$("#RMIContents").html('');

				this.subGroupLists = this.mainGroupLists.reduce(function (pre, value) {
					if(value.MainGroupId === selected) {
						return [...pre, ...value.SubGroups];
					}
					else {
						return pre;
					}
				}, []);	
			},
			changeSubGroup() {
				var selected = this.subGroupId;
				this.qualColLists = [];

				this.manualId = '';		
				
				$("#RMIContents").html('');

				this.itemMpLists = this.subGroupLists.reduce(function (pre, value) {
					if(value.SubGroupId === selected) {
						return [...pre, ...value.ItemMps];
					}
					else {
						return pre;
					}
				}, []);	
			},
			changeItemMp() {
				var selected = this.itemMpId;

				$("#RMIContents").html('');

				this.qualColLists = this.itemMpLists.reduce(function (pre, value) {
					if(value.ItemMpId === selected) {
						return [...pre, ...value.Manuals];
					}
					else {
						return pre;
					}
				}, []);	
			},
			changeManualId() {
				let languageCode = 'en',
					countryCode = 'kr',
					printView = true,
					linkUrl = '.',
					manualId = this.manualId,
					typeId = this.carTypeId;		
					
				// Build url query string
				let query = '?languageCode=' + languageCode
					+ '&countryCode=' + countryCode
					+ '&typeId=' + typeId	
					+ '&manualId=' + manualId	
					+ '&printView=' + printView	
					+ '&linkUrl=' + linkUrl	
				
				// Send HTTP request
				let xmlHttp = new XMLHttpRequest();
				xmlHttp.open( 'GET', url + '/ManualHtml' + query, false );
				xmlHttp.setRequestHeader( 'Content-type', 'application/json;charset=UTF-8' );
				xmlHttp.setRequestHeader( 'Accept', 'application/json' );
				xmlHttp.setRequestHeader( 'Authorization', this.rmiAuthKey );
				xmlHttp.send( null );
				// Handle HTTP response
				if(xmlHttp.status == 200) {
					console.log(xmlHttp.responseText);
					let page = xmlHttp.responseText.replace('<img src=\"https://rmi-cdn.tecalliance.net/services/Logo.png\" height=\"60px\" border=\"0\" alt=\"\"/>\r\n', '');
					$("#RMIContents").html(JSON.parse(page));
				}	
			},
			clickPopup() {
				this.translateMessage = document.getElementById('btnFuncTranslateDelegate').value.replace(/\n/gi, '<br>');
				this.showTranslateMessage = true;				
				$("#RMITranslate").html(this.translateMessage);
			}
		},   		
	}
</script>

<style scoped>
.contents {
  background-color: #f9f9f9;
  color: black;
  font-size: 12px;
}

.contents .adjustSelect {
  background-color: #666;
  font-size: 12px;
}

.contents .border {
  border: 2px dashed orange;
}

#RMIContents {
	background-color: white; 
	color: black;
	border-style: solid;
	border-radius: 5px;
	border-width: thick;
	border-color: #fddca9;
}

</style>

