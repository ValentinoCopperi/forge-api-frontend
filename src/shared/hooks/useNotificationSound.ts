import { useCallback, useEffect, useRef } from "react";
import useSound from "use-sound";

const NOTIFICATION_SOUND = "/sounds/notification-sound.wav";

export function useNotificationSound() {
    const [play] = useSound(NOTIFICATION_SOUND, {
        volume: 1,
        interrupt: true,
    });
    const playRef = useRef(play);
    const pendingPlayRef = useRef(false);
    const fallbackAttachedRef = useRef(false);

    useEffect(() => {
        playRef.current = play;
    }, [play]);

    const attachFallback = useCallback(() => {
        if (fallbackAttachedRef.current) return;
        fallbackAttachedRef.current = true;

        const onInteraction = () => {
            fallbackAttachedRef.current = false;

            if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                playRef.current();
            }

            window.removeEventListener("pointerdown", onInteraction);
            window.removeEventListener("keydown", onInteraction);
        };

        window.addEventListener("pointerdown", onInteraction, { once: true });
        window.addEventListener("keydown", onInteraction, { once: true });
    }, []);

    const playNotification = useCallback(() => {
        pendingPlayRef.current = true;

        const probe = new Audio(NOTIFICATION_SOUND);
        probe.volume = 0;

        void probe
            .play()
            .then(() => {
                probe.pause();
                probe.currentTime = 0;
                pendingPlayRef.current = false;
                playRef.current();
            })
            .catch(() => {
                attachFallback();
            });
    }, [attachFallback]);

    return playNotification;
}
