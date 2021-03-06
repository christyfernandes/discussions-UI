import { FormGroup, FormBuilder } from '@angular/forms';
import { DiscussionService } from './../../services/discussion.service';
import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NSDiscussData } from './../../models/discuss.model';

/* tslint:disable */
import * as _ from 'lodash'
/* tslint:enable */

@Component({
  selector: 'lib-discuss-start',
  templateUrl: './discuss-start.component.html',
  styleUrls: ['./discuss-start.component.css']
})
export class DiscussStartComponent implements OnInit {

  @Input() categoryId: string;
  @Output() close = new EventEmitter();

  startForm!: FormGroup;
  allCategories!: NSDiscussData.ICategorie[];
  allTags!: NSDiscussData.ITag[];
  postTagsArray: string[] = [];
  uploadSaveData = false;
  showErrorMsg = false;
  createErrorMsg = '';
  defaultError = 'Something went wrong, Please try again after sometime!';

  constructor(
    private discussService: DiscussionService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.initializeData();
    this.startForm = this.formBuilder.group({
      question: [],
      description: [],
      tags: [],
    });
  }

  initializeData() {
    this.discussService.fetchAllTag().subscribe(data => {
      this.allTags = _.get(data, 'tags');
    });
  }
  showError(meta: string) {
    if (meta) {
      return true;
    }
    return false;
  }

  public submitPost(form: any) {
    form.value.tags = this.postTagsArray;
    this.uploadSaveData = true;
    this.showErrorMsg = false;
    const postCreateReq = {
      cid: this.categoryId,
      title: form.value.question,
      content: form.value.description,
      tags: form.value.tags,
    };
    this.discussService.createPost(postCreateReq).subscribe(
      () => {
        this.closeModal();
        form.reset();
        this.uploadSaveData = false;
        // success toast;
        // this.openSnackbar(this.toastSuccess.nativeElement.value)
        // close the modal
      },
      err => {
        this.closeModal();
        // error toast
        // .openSnackbar(this.toastError.nativeElement.value)
        this.uploadSaveData = false;
        if (err) {
          if (err.error && err.error.message) {
            this.showErrorMsg = true;
            this.createErrorMsg = err.error.message.split('|')[1] || this.defaultError;
          }
        }
      });
  }

  closeModal() {
    this.close.emit({message: 'close modal'});
  }



}

