@include('users._user_name')
<div class="row h4 text-center stat">
    <span><a href="{{route('user.followings', $user->id)}}">关注{{ $info->following_count }}</a></span>
    &nbsp;&nbsp;

    &nbsp;&nbsp;
    <span><a href="{{route('user.followers', $user->id)}}">粉丝{{ $info->follower_count }}</a></span>
</div>

<div class="stats h5">
    <span>盐粒：{{ $info->salt }}</span>&nbsp;&nbsp;&nbsp;
    <span>咸鱼：{{ $info->fish }}</span>&nbsp;&nbsp;&nbsp;
    <span>火腿：{{ $info->ham }}</span>&nbsp;&nbsp;&nbsp;
    @if(Auth::check()&&(Auth::user()->isAdmin()||Auth::id()===$user->id))
    <br><span>连续签到：{{ $info->qiandao_continued }}天</span>&nbsp;&nbsp;&nbsp;
    <span>最多连续签到：{{ $info->qiandao_max }}天</span>&nbsp;&nbsp;&nbsp;
    <br><span>总签到：{{ $info->qiandao_all }}天</span>&nbsp;&nbsp;&nbsp;
    <span>最后签到时间：{{ $user->qiandao_at->diffForHumans() }}</span>
    @endif
</div>
<div class="text-center stats h5">
    @if ((Auth::check())&&($user->id != Auth::id()))
    <button type="button" class="btn btn-lg btn-primary sosad-button-control {{'follow'.$user->id}} {{Auth::user()->isFollowing($user->id) ? 'hidden':''}}" onclick="follow({{$user->id}})">关注</button>
    <button type="button" class="btn btn-lg btn-danger sosad-button {{'cancelfollow'.$user->id}} {{Auth::user()->isFollowing($user->id) ? '':'hidden'}}" onclick="cancelfollow({{$user->id}})">取消关注</button>
    @endif
    @if(Auth::check()&&Auth::id()!=$user->id)
    &nbsp;&nbsp;&nbsp;
    <a href="{{route('message.dialogue', $user->id)}}" class="btn btn-lg btn-primary sosad-button-control">私信</a>
    &nbsp;&nbsp;&nbsp;
    @endif
    @if($info->default_box_id>0)
    <a href="{{route('thread.show', $info->default_box_id)}}" class="btn btn-lg btn-primary sosad-button-control">提问</a>
    @endif
</div>
<br>
@if($intro&&$intro->body)
<div class="h5 text-center">
    <span>{!! StringProcess::wrapParagraphs($intro->body) !!}</span>
</div>
@endif
@if((Auth::check())&&(Auth::user()->isAdmin()))
<div class="text-center row">
    <div class="col col-xs-6">
        <a href="{{route('admin.userform', $user->id)}}"class="btn btn-lg btn-danger sosad-button admin-button">管理该用户</a>
    </div>
    <div class="col col-xs-6">
        <a href="{{route('administrationrecords', ['user_id'=>$user->id])}}"class="btn btn-lg btn-danger sosad-button admin-button">管理记录</a>
    </div>
</div>
<br>
@endif
