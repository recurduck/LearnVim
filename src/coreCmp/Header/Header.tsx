import type { Component } from 'solid-js';
import fileManager from '../../managers/fileManager';
import './Header.scss';
import { openModal } from '../../store/actions';
import { about } from './content.js'
const Header: Component = () => {
  const onOpenModal = () => {
    openModal('About', () => (<pre onClick={e => e.stopPropagation()}>{about}</pre>))
  }
  return (
    <header class="header">
      <a href="" class="logo">Vim Online</a>
      <input class="menu-btn" type="checkbox" id="menu-btn" />
      <label class="menu-icon" for="menu-btn"><span class="navicon"></span></label>
      <ul class="menu">
        <li>
          <label for="inputfile">
            <a>
              Upload
            </a>
          </label>
          <input type="file" name="inputfile" id="inputfile" />
        </li>
        <li><a onClick={fileManager.download}>Download</a></li>
        <li><a onClick={onOpenModal}>About</a></li>
      </ul>
    </header>
  );
};

export default Header;
