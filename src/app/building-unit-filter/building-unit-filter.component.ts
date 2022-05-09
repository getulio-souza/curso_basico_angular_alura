import { TranslateService } from '@ngx-translate/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { ContextService } from '../services/context/context.service';
import { StructureService } from '@alis/tracking-ng';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'building-unit-filter',
  templateUrl: './building-unit-filter.component.html',
  styleUrls: ['./building-unit-filter.component.scss']
})
export class BuildingUnitFilterComponent implements OnInit, OnChanges {

  /** INPUTS */
  @Input() structure;
  @Input() properties;
  @Input() propertyId;

  // if true will show 'all' in dropdown
  @Input() showAllAsOption = true;

  // if true, will start step1 with this value selected
  @Input() startsWith;

  // if true, will show step2 dropdown
  @Input() showStep2 = false;
  
  //ex: 1
  @Input() subdivisionFilterLevel;

  //ex: 'ala'
  @Input() subdivisionFilterLabel;
  
  //if you want to change externally the input step 1
  @Input() externalChangeStep1;
  
  //if you want to change externally the input step 2
  @Input() externalChangeStep2;
  
  /** END INPUTS */


  /** OUTPUTS */
  // emitted when step1Filter has been changed
  @Output() onChangeStructureFilterEmitter = new EventEmitter<Object>();

  // emitted when step2Filter has been changed
  @Output() onChangeStructureFilterEmitter2 = new EventEmitter<Object>();
  /** END OUTPUTS */

  structureFiltersStep1 = [];
  structureFiltersOptionsStep1 = [];
  structureFiltersStep2 = [];
  structureFilteredStep1;
  structureFilteredStep2;


  constructor(
    private structureService: StructureService,
    private contextService: ContextService,
    private translateService: TranslateService
    
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes.externalChangeStep2 != null){
      this.structureFilteredStep2 = changes.externalChangeStep2.currentValue;
    }

    if(changes.externalChangeStep1 != null){
      this.structureFilteredStep1 = changes.externalChangeStep1.currentValue;
      this.contextService.structureFilteredMap[this.subdivisionFilterLevel] = this.structureFilteredStep1;
    }
  }
  ngOnInit() {

    if(this.structureFilteredStep1 == null) {
      this.structureFilteredStep1 = this.structure;
    }

    this.buildStep1Dropdown();
    this.translateService.onLangChange.subscribe((res) => {

      // if a translation change is detected
      // lets rebuild step 1 dropdown
      this.buildStep1Dropdown();

      // and then, guarantee that the current selected item
      // will be translated
      let translated = this.structureFilteredStep1.currentLabel;
      
      this.updateStep1InputValue(translated);
    })
  }

  


  /**
   * if the same element has been clicked
   * lets just ignore it
   * @param event event
   * @param label the label clicked
   */
  onStep1Click(event: Event,label) {
    if(label == this.structureFilteredStep1.name) {
      event.stopPropagation();
    }
  }

  buildStep1Dropdown() {

    this.structureFiltersStep1 = [];

    if (this.showAllAsOption) {
      
      this.structure['currentLabel'] =  this.translateService.instant('All');;
      this.structureFiltersStep1.push({ label: this.structure.currentLabel, value: this.structure });
    }

    let structures = this.structureService.getAllStructIdsByGivenStructureAndLevel(this.structure, this.subdivisionFilterLevel)
    structures.forEach((structureId) => {
      let filterStructure = this.structureService.getStructureByGivenStructureId(this.structure, structureId);
      let filterStructureName = filterStructure['name'];
      filterStructure['currentLabel'] = filterStructure['name'];
      this.structureFiltersStep1.push({ label: filterStructureName, value: filterStructure });
    });

    this.checkValueToStart();

  }

  /**
   * Will check if dropdown should start with a specific value
   * First it checks if 'startsWith' is not null
   * If it is it checks if structureFilteredMap has already value for
   * the selected 'subdivisionFilterLevel'
   */
  checkValueToStart() {
    // if startswith != null should start with it
    if (this.startsWith != null) {
      this.onChangeStructureFilterStep1({ value: this.startsWith });
    } else {
      // else check if the subdivisionFilterLevel has alrady been selected
      const alreadySelected = this.contextService.structureFilteredMap[this.subdivisionFilterLevel];
      if (alreadySelected != null) {
        this.onChangeStructureFilterStep1({ value: alreadySelected });
      } else {
        this.onChangeStructureFilterStep1({ value: this.structureFiltersStep1[0].value });
      }
    }

  }

  /**
   * Emits structure filter for emitter
   * and updates the service
   */
  emitStructureFilterChangesStep1(structureSelected) {
    this.onChangeStructureFilterEmitter.emit(structureSelected);
  }

  emitStructureFilterChangesStep2(structureSelected) {
    this.onChangeStructureFilterEmitter2.emit(structureSelected);
  }

  onChangeStructureFilterStep1(filter) {

    let value = filter.value;

    this.structureFilteredStep1 = value;
    this.updateStep2Structures(value);
    this.emitStructureFilterChangesStep1(value);
    
    this.contextService.structureFilteredMap[this.subdivisionFilterLevel] = value;
    this.updateStep1InputValue(this.structureFilteredStep1.currentLabel);
  }

  updateStep1InputValue(newValue) {
    let inputs = document.getElementsByTagName("input");
    if(inputs.length > 0){
      // since we know that the first input is the step1 selector
      // we can change its value
      inputs[0].value = newValue;
    }
  }

  onChangeStructureFilterStep2(filter) {
    let value = filter.value;

    this.structureFilteredStep2 = value;
    this.emitStructureFilterChangesStep2(value);
  }

  updateStep2Structures(structure) {

    this.structureFiltersStep2 = [];

    // add the first one if there is no structureFilteredStep2 selected yet
    if(this.structureFilteredStep2 == null){
      this.structureFilteredStep2 = this.structureFiltersStep2[0];
    }
    this.structureFiltersStep2 = this.buildStructureFilters2ByStructure(structure, this.structureFiltersStep2);

  }

  buildStructureFilters2ByStructure(structure, structureFiltersArray) {

    let unitsLevel0Ids: Set<any> = this.structureService.getAllStructIdsByGivenStructureAndLevel(structure,0);

    unitsLevel0Ids.forEach( (unitId) => {
      let filterStructure = this.structureService.getStructureByGivenStructureId(structure, unitId);
      let filterStructureName = filterStructure['name'];
      structureFiltersArray.push({ label: filterStructureName, value: filterStructure }) 
    });

    return structureFiltersArray;
  }

  filterStructures(event) {
    this.structureFiltersOptionsStep1 = [];
    for(let i = 0; i < this.structureFiltersStep1.length; i++) {
        let currentStructureFilter = this.structureFiltersStep1[i];
        if(currentStructureFilter.label == null) { continue ; }
        if(currentStructureFilter.label.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.structureFiltersOptionsStep1.push(currentStructureFilter);
        }
    }

    console.log(this.structureFiltersOptionsStep1)
  }
}
