import * as React from 'react';
import { API, ResData, ReqData } from '../../../config/api';
import { MobileRouteProps } from '../router';
import { Page } from '../../components/common/page';
import { NavBar } from '../../components/common/navbar';
import { Card } from '../../components/common/card';
import { ChatBubble } from '../../components/message/chat-bubble';
import { TextEditor } from '../../components/common/textEditor';

// TODO: implement fetch new msg by scroll up: https://www.pubnub.com/blog/react-chat-message-history-and-infinite-scroll/

interface State {
  data:API.Get['/user/$0/message'];
  messageToSend:string;
}

export class Dialogue extends React.Component<MobileRouteProps, State> {
  public state:State = {
    data:{
      messages: [],
      paginate: ResData.allocThreadPaginate(),
      style: ReqData.Message.style.dialogue,
    },
    messageToSend: '',
  };
  public async componentDidMount() {
    try {
      const query = {
        withStyle: ReqData.Message.style.dialogue,
        chatWith: this.props.match.params.uid,
      };
      const data = await this.props.core.db.getMessages(query);
      data.messages.reverse();
      this.setState({data});
    } catch (e) {
      console.log(e);
    }
  }

  public componentDidUpdate (prevProps, prevState) {
    if (prevState.data.messages.length != this.state.data.messages.length) {
      this.scrollToLatestMsg();
    }
  }

  private scrollToLatestMsg() {
    const { messageListRef } = this;
    if (messageListRef) {
      const scrollHeight = messageListRef.scrollHeight;
      const height = messageListRef.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messageListRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }

  private messageListRef:HTMLDivElement|null = null;
  public render () {
    return (<Page className="dialogue-page"
        top={<NavBar goBack={this.props.core.route.back} onMenuClick={() => console.log('open setting')}>
          {this.props.location.state && this.props.location.state.chatWithName}
        </NavBar>}>
        <Card className="dialogue-card" ref={(card) => this.messageListRef = card ? card.rootElement : null}>
          {this.state.data.messages.map((m) => this.renderMessage(m))}
        </Card>
        { this.textBox() }
      </Page>);
  }
  protected updateMessageToSend = (value:string) => this.setState({messageToSend:value});
  private textBox () : JSX.Element {
    return (
      <div id="pm-text-box">
        <TextEditor theme="bubble" placeholder="写回复"/>
        <span className="icon sendbutton" onClick={this.sendMessage}>
            <i className="far fa-paper-plane"/>
          </span>
      </div>
    );
  }

  private sendMessage = async () => {
    if (!this.state.messageToSend) { return; }
    try {
      const msg = await this.props.core.db.sendMessage(this.props.match.params.uid, this.state.messageToSend);
      const data = {...this.state.data, messages: [...this.state.data.messages, msg.message]};
      this.setState({data, messageToSend:''});
    } catch (e) {
      console.log(e);
    }
  }

  private renderMessage (m:ResData.Message) : JSX.Element {
    const myID:number = this.props.core.user.id;
    const fromMe:boolean = myID == m.attributes.poster_id;
    const posterName:string = fromMe ? '我' : m.poster ? m.poster.attributes.name : ' ';
    const content:string = m.message_body ? m.message_body.attributes.body : '';
    return (<div key={m.id} className="message-item">
              <p className={`poster-name${fromMe ? ' from-me' : ''}`}>{posterName}</p>
              <ChatBubble fromMe={fromMe} content={content}></ChatBubble>
            </div>);
  }
}