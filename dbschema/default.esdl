using extension auth;

module default {
  global current_moderator := (
    assert_single((
      select Moderator {account, email}
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

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

  abstract type Thread {
    title: str;
    multi messages: Message {
      on target delete allow
    };

    draft := .<thread[is QNADraft];
    qna := .<thread[is QNA];
    first_msg := (select .messages limit 1).content;
  }

  type Tag {
    required name: str {
      constraint exclusive;
    }

    qnas := .<linkedTags[is QNA];
  }

  type QNA {
    required title: str;
    required question: str;
    required answer: str;
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

  abstract type Message {
    required author: User;
    required content: str;
    required created_at: datetime {
      default := datetime_current()
    }

    attachments: array<str>; 

    index fts::index on (
      fts::with_options(
        .content,
        language := fts::Language.eng
      )
    );
  }
}