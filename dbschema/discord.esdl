module discord {
  type HelpChannel {
    required name: str;

    required channel_id: str {
      constraint exclusive;
    };
  }

  type Message extending default::Message {
    required message_id: str {
      constraint exclusive;
    };
  }

  type User extending default::User {}

  type Thread extending default::Thread {
    required thread_id: str {
      constraint exclusive;
    };

    multi suggested_by: discord::User;
    review_card: ReviewCard;
  }

  type ReviewCard {
    required message_id: str {
      constraint exclusive;
    };

    # the thread attached to this card, not the thread it is from.
    required thread_id: str {
      constraint exclusive;
    };
  }
}