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

  type Revision {
    required author: Moderator;
    content: str;
    revised_at: datetime;
  }

  abstract type QNASource {
    url: str;
  }

  abstract type Thread {
    title: str;
    multi messages: Message {
      on target delete allow
    };

    draft := .<thread[is QNADraft];
    qna := .<thread[is QNA];
    first_msg := (select .messages limit 1).displayed_content;

    index fts::index on (
      fts::with_options(
        .title,
        language := fts::Language.eng
      )
    );
  }

  type Tag {
    required name: str {
      constraint exclusive;
    }

    qnas := .<linkedTags[is QNA];
  }

  type QNA {
    required slug: str {
      readonly := true;
      constraint regexp(r'[a-z0-9_]*');
      constraint exclusive;
    }
    required title: str;
    required question: str;
    required answer: str;
    required multi linkedTags: Tag;
    tags := .linkedTags.name;

    required thread: Thread {
      constraint exclusive;
    }
  }

  type QNADraft {
    prompt: str;
    title: str;
    question: str;
    answer: str;
    multi linkedTags: Tag;
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

  abstract type Message {
    required author: User;
    required content: str;
    required created_at: datetime {
      default := datetime_current()
    }

    multi revisions: Revision;

    displayed_content := (
      select (
        .content 
        IF 
          NOT (EXISTS (.revisions)) 
        ELSE (
           (select .revisions order by .revised_at desc limit 1).content
        )
      )
    );

    index fts::index on (
      fts::with_options(
        .content,
        language := fts::Language.eng
      )
    );
  }
}