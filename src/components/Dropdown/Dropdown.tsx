import * as React from 'react';
import './Dropdown.scss';
import { css } from '../../utilities/css';
import { findIndex } from '../../utilities/array';
import KeyCodes from '../../utilities/KeyCodes';

export interface IDropdownOption {
  key: string;
  text: string;
  isSelected?: boolean;
}

export interface IDropdownProps {
  label: string;
  options: IDropdownOption[];
  onChange?: (option: IDropdownOption, index?: number) => void;
  isDisabled?: boolean;
}

export interface IDropdownState {
  isOpen: boolean;
  selectedIndex: number;
  isDisabled: boolean;
}

export default class Dropdown extends React.Component<IDropdownProps, any> {
  static defaultProps = {
    options: [],
    isDisabled: false
  }

  constructor(props?: IDropdownProps) {
    super(props);

    this.state = {
      isOpen: false,
      selectedIndex: findIndex(props.options, (option => option.isSelected)),
      isDisabled: this.props.isDisabled
    };

    this._onDropdownKeyDown = this._onDropdownKeyDown.bind(this);
    this._onDropdownClick = this._onDropdownClick.bind(this);
    this._onDropdownBlur = this._onDropdownBlur.bind(this);
  }

  public render() {
    let rootClass = 'ms-Dropdown';
    let { label, options } = this.props;
    let { isOpen, selectedIndex, isDisabled } = this.state;
    let selectedOption = options[selectedIndex];

    return (
      <div>
        <span className="ms-Label">{ label }</span>
        <div
          className={ css('ms-Dropdown', {
            'is-open': isOpen, 'is-disabled': isDisabled
            }) }
          tabIndex={ 0 }
          onKeyDown={ this._onDropdownKeyDown }
          onClick={ this._onDropdownClick }
          onBlur={ this._onDropdownBlur }
        >
          <i className="ms-Dropdown-caretDown ms-Icon ms-Icon--caretDown"></i>
          <span className="ms-Dropdown-title">{ selectedOption ? selectedOption.text : '' }</span>
          <ul className="ms-Dropdown-items">
            { options.map((option, optionIndex) => (
            <li key={ option.key }
                className={ css('ms-Dropdown-item', { 'is-selected': selectedIndex === optionIndex }) }
                onClick={ this.setSelectedIndex.bind(this, optionIndex) }
              >
                { option.text }
            </li>
            )) }
          </ul>
        </div>

      </div>
    );
  }

  public setSelectedIndex(index: number) {
    let { onChange, options } = this.props;
    let { selectedIndex } = this.state;

    index = Math.max(0, Math.min(options.length - 1, index));

    if (index !== selectedIndex) {
      // Set the selected option.
      this.setState({
        selectedIndex: index
      });

      if (onChange) {
        onChange(options[index], index);
      }
    }
  }

  private _onDropdownKeyDown(ev: React.KeyboardEvent) {
    switch (ev.which) {
      case KeyCodes.enter: {
	       this.setState({
           isOpen: !this.state.isOpen
         });
         break;
      }
      case KeyCodes.escape: {
        this.setState({
          isOpen: false
        });
        break;
      }
      case KeyCodes.up: {
        this.setSelectedIndex(this.state.selectedIndex - 1);
        break;
      }
      case KeyCodes.down: {
        this.setSelectedIndex(this.state.selectedIndex + 1);
        break;
      }
      case KeyCodes.home: {
        this.setSelectedIndex(0);
        break;
      }
      case KeyCodes.end: {
        this.setSelectedIndex(this.props.options.length - 1);
        break;
      }
      default:
        return;
    }

    ev.stopPropagation();
    ev.preventDefault();
  }

  private _onDropdownClick() {
    let { isDisabled, isOpen } = this.state;
    let { options } = this.props;

    if (!isDisabled) {
      this.setState({
        isOpen: !isOpen
      });
    }
  }

  private _onDropdownBlur() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  }

}

