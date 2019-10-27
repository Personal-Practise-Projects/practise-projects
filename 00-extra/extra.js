<div
  class="category-list category-list-tab list-options"
  [hidden]="currentActiveFilterType != contentFilterTypes[1].name"
>
  <div class="category-list-wrapper source-san">
    <div class="row no-gutters">
      <div
        class="col-12 col-sm-6"
        *ngFor="let data of contentFilters?.category"
      >
        <div class="list-item">
          <label class="checkmark-container">
            <span class="checkmark-name">{{ data | titlecase }}</span>
            <input
              type="checkbox"
              [checked]="isFilterSelected(data)"
              name="category"
              [id]="data"
              (click)="onFilterSelect(data)"
            />
            <span class="checkmark-interface"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
<div
  class="category-list category-list-tab list-options"
  [hidden]="currentActiveFilterType != contentFilterTypes[2].name"
>
  <div class="category-list-wrapper source-san">
    <div class="row no-gutters">
      <div
        class="col-12 col-sm-6"
        *ngFor="let data of contentFilters?.products"
      >
        <div class="list-item">
          <label class="checkmark-container">
            <span class="checkmark-name">{{ data | titlecase }}</span>
            <input
              type="checkbox"
              [checked]="isFilterSelected(data)"
              name="products"
              [id]="data"
              (click)="onFilterSelect(data)"
            />
            <span class="checkmark-interface"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>