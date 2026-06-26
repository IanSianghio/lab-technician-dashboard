import { useEffect, useRef } from 'react';
import { useDashboard } from '../context/useDashboard';

const PI_URL  = 'http://192.168.40.4:5000';
const POLL_MS = 2000;

export function useAlertPoller() {
  const { state, dispatch } = useDashboard();
  const knownIds    = useRef(new Set(state.alerts.map((a) => a.id)));
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  useEffect(() => {
    const poll = async () => {
      try {
        const res  = await fetch(`${PI_URL}/api/alerts`);
        const data = await res.json();
        for (const alert of data) {
          if (!knownIds.current.has(alert.id)) {
            knownIds.current.add(alert.id);
            dispatchRef.current({ type: 'ADD_ALERT', alert });
          }
        }
      } catch {
        // Pi unreachable — silent fail, will retry next poll
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, []); // empty — poll loop runs once, uses refs to stay current
}