import React, { ChangeEvent, Component, FormEvent } from 'react';

interface Props {
  message?: string;
  onModelSet?: (sid: string, session: string) => void;
}

interface State {
  name: string;
  sid: string;
}

export class SetModel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      sid: 'j4RZx7ZGM6T',
    };

    this.onNameChanged = this.onNameChanged.bind(this);
    this.onSidChanged = this.onSidChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  private onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onModelSet(this.state.sid, this.state.name);
  }

  private onNameChanged(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
  }

  private onSidChanged(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ sid: event.target.value });
  }

  render(): JSX.Element {
    return (
      <div className="set-model-container">
        <div className="set-model-title">HOST A SESSION</div>
        <form className="set-model-form" onSubmit={this.onSubmit}>
          <label>
            Session Name
            <input type="text" value={this.state.name} onChange={this.onNameChanged}></input>
          </label>
          <label>
            Model SID
            <input type="text" value={this.state.sid} onChange={this.onSidChanged}></input>
          </label>
          <input className="set-model-button" type="submit" value="START"></input>
        </form>
        <div className="set-model-message">{this.props.message}</div>
      </div>
    );
  }
}
