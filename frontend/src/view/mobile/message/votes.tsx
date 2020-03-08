import * as React from 'react';
import { MobileRouteProps } from '../router';
import { Page } from '../../components/common/page';
import { List } from '../../components/common/list';
import { NavBar } from '../../components/common/navbar';
import './style.scss';
import { DBResponse } from '../../../core/db';
import { API, ResData } from '../../../config/api';
import { VoteItem } from './vote-item';
import { Toolbar } from './toolbar';

interface State {
  votesReceived:API.Get['/user/$0/vote_received'];
  votesSent:API.Get['/user/$0/vote_sent'];
  filter:filterType;
}
type filterType = 'all' | 'received' | 'sent';
const filterOptions = [
  {text: '全部', value: 'all'},
  {text: '收到的赞', value: 'received'},
  {text: '给出的赞', value: 'sent'},
];

// TODO: content are waiting for API fix: https://trello.com/c/bxlkk1Eb/219-api-show-user-vote%E6%B2%A1%E6%9C%89author%EF%BC%8Cattitue%E5%92%8Ccontent
// TODO: probably refactor vote and reward => write a parent class for them, a lot of dup code

export class Votes extends React.Component<MobileRouteProps, State> {
  public state:State = {
    votesReceived: [],
    votesSent: [],
    filter: 'all',
  };

  public async componentDidMount() {
    const { getUserVotesReceived, getUserVotesSent } = this.props.core.db;
    const fetchVotesReceived = getUserVotesReceived()
      .catch((e) => {
        console.log(e);
        return this.state.votesReceived;
      });
    const fetchVotesSent = getUserVotesSent()
      .catch((e) => {
        console.log(e);
        return this.state.votesSent;
      });
    const [votesReceived, votesSent] = await Promise.all([fetchVotesReceived, fetchVotesSent]);
    this.setState({votesReceived, votesSent});
    console.log(votesReceived, votesSent);
  }

  public deleteVote = (voteId:number) => async () => {
    try {
      await this.props.core.db.deleteVote(voteId);
      let votesSent = this.state.votesSent;
      votesSent.splice(votesSent.findIndex( (r) => r.id == voteId), 1);
      this.setState({votesSent});

      // due to pagination, after we delete a vote, we have space for vote in page 2
      votesSent = await this.props.core.db.getUserVotesSent();
      this.setState({votesSent});
    } catch (e) {
      console.log(e);
    }
  }

  public setFilterOption = (option:string, i:number) => {
    this.setState({filter:option as filterType});
  }

  public render () {
    return (<Page className="msg-page"
        top={<NavBar goBack={this.props.core.route.back}>
          点赞提醒
        </NavBar>}>

        <Toolbar
          filterOptions={filterOptions}
          setFilterOption={this.setFilterOption}
        />

        { this.renderVotes() }
      </Page>);
  }

  private getVotes() {
    let selectedVotes:ResData.Vote[] = [];
    switch (this.state.filter) {
      case 'all':
        selectedVotes = [...this.state.votesReceived, ...this.state.votesSent];
        break;
      case 'received':
        selectedVotes = this.state.votesReceived;
        break;
      case 'sent':
        selectedVotes = this.state.votesSent;
        break;
    }

    return selectedVotes
      .sort((r1, r2) => {
        const d1 = new Date(r1.attributes.created_at);
        const d2 = new Date(r2.attributes.created_at);
        return (d2.getTime() - d1.getTime());
      });
  }

  private renderVotes () {
    const votes = this.getVotes();
    return (
      <List className="message-list">
        {votes.map((d) =>
          <VoteItem
            key={d.id}
            read={false}
            vote={d}
            userId={this.props.core.user.id}
            deleteVote={this.deleteVote}
          />)}
      </List>);
  }
}