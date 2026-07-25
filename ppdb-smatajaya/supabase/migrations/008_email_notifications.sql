-- Migration 008: Email notification webhook on status change
-- This creates a database trigger that calls the send-status-email Edge Function
-- when a participant's status changes.

-- Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Use pg_net to make an HTTP request to the Edge Function
    -- Note: pg_net must be enabled in your Supabase project
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/send-status-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'participant_id', NEW.id,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_participant_status_change
  AFTER UPDATE OF status ON participants
  FOR EACH ROW
  EXECUTE FUNCTION notify_status_change();

-- Also trigger on initial insert with non-draft status (shouldn't happen normally, but safety net)
CREATE OR REPLACE FUNCTION notify_status_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != 'draft' THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/send-status-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'participant_id', NEW.id,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
