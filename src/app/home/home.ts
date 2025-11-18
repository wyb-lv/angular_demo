import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// Bootstrap Modal
declare var bootstrap: any;

export interface Item {
  id: string;
  name: string;
  description?: string;
  price?: number;
  docid?: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  firestore: Firestore = inject(Firestore);
  aCollection: CollectionReference;
  items: Observable<Item[]>;

  // modal data
  newItemName: string = "";
  newItemDescription: string = "";
  newItemPrice: number | null = null;
  editingId: string = "";
  editingName: string = "";
  editingDescription: string = "";
  editingPrice: number | null = null;
  addSubmitted: boolean = false;
  updateSubmitted: boolean = false;

  addModal: any;
  updateModal: any;

  constructor() {
    this.aCollection = collection(this.firestore, 'items');
    this.items = collectionData(this.aCollection, { idField: 'docid' }) as Observable<Item[]>;
  }

  //event listener

  openAddModal() {
    this.newItemName = "";
    this.newItemDescription = "";
    this.newItemPrice = null;
    this.addModal = new bootstrap.Modal(document.getElementById('addModal'));
    this.addModal.show();
  }

  closeAddModal() {
    this.addModal.hide();
  }

  openUpdateModal(item: Item) {
    this.editingId = item.docid!;
    this.editingName = item.name;
    this.editingDescription = item.description ?? "";
    this.editingPrice = item.price ?? 0;

    this.updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    this.updateModal.show();
  }

  closeUpdateModal() {
    this.updateModal.hide();
  }

  //modal handler

  async handleAdd() {
    this.addSubmitted = true;

    if (!this.newItemName?.trim()) return;
    if (!this.newItemDescription?.trim()) return;
    if (!this.newItemPrice || this.newItemPrice <= 0) return;

    await this.addItem(this.newItemName);
    this.addSubmitted = false;
    this.closeAddModal();
  }

  async handleUpdate() {
    this.updateSubmitted = true;

    if (!this.editingName?.trim()) return;
    if (!this.editingDescription?.trim()) return;
    if (!this.editingPrice || this.editingPrice <= 0) return;

    await this.update(this.editingId, this.editingName);

    this.updateSubmitted = false;
    this.closeUpdateModal();
  }


  async addItem(name: string) {
    if (!name.trim()) return console.warn('Name empty');

    const it: Item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: this.newItemDescription?.trim(),
      price: this.newItemPrice ?? 0
    };

    await addDoc(this.aCollection, it);
  }

  async update(docid: string, newName: string) {
    if (!newName.trim()) return console.warn('Name empty');

    const docRef = doc(this.aCollection, docid);
    await updateDoc(docRef, {
      name: this.editingName.trim(),
      description: this.editingDescription?.trim(),
      price: this.editingPrice ?? 0});
  }

  async deleteItem(docid: string) {
    const docRef = doc(this.aCollection, docid);
    await deleteDoc(docRef);
  }
}
