using extension auth;

module default {
  global current_moderator := (
    assert_single((
      select Moderator {account, email}
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  abstract type Singleton {
    delegated constraint exclusive on (true);
  }

  type Prompt extending Singleton {
    required content: str;
  }

  abstract type User {
    name: str;
    required user_id: str {
      delegated constraint exclusive;
    };
  }

  type Moderator {
    required identity: ext::auth::Identity {
        constraint exclusive;
    };
    required email: str {
      constraint exclusive;
    }
    required account: User {
       constraint exclusive;
    }
  }

  type Tag {
    required name: str {
      constraint exclusive;
    };

    disabled: bool {
      default := false; 
    };

    qnas := .<linkedTags[is QNA];
  }

  # make messages required
  abstract type Thread {
    multi messages: Message {
      on target delete allow
    };

    draft := .<thread[is QNADraft];
    qna := .<thread[is QNA];
  }

  abstract type Message {
    required author: User;
    required content: str;
    required created_at: datetime {
      default := datetime_current()
    };

    attachments: array<str>; 

    index fts::index on (
      fts::with_options(
        .content,
        language := fts::Language.eng
      )
    );
  }

  type QNADraft {
    prompt: str;
    title: str;
    question: str;
    answer: str;
    multi linkedTags: Tag {
      on target delete allow;
    }
    tags := .linkedTags.name;
    
    required thread: Thread {
      constraint exclusive;
    }

    index fts::index on ((
      fts::with_options(
        .question,
        language := fts::Language.eng
      ),
       fts::with_options(
        .answer,
        language := fts::Language.eng
      )
    ));
  }

  type QNA {
    required title: str;
    required question: str;
    required answer: str;
    # do we wanna leave deletion policy here just in case
    # maybe we decide at some point we wanna delete some tag
    multi linkedTags: Tag {
      on target delete allow;
    }
    tags := .linkedTags.name;

    required thread: Thread {
      constraint exclusive;
    }

    index fts::index on ((
      fts::with_options(
        .title,
        language := fts::Language.eng
      ),
      fts::with_options(
        .question,
        language := fts::Language.eng
      ),
      fts::with_options(
      .answer,
      language := fts::Language.eng
      )
    ));
  }
}


