---
description: Quy trình phát triển bắt buộc — Superpowers-style workflow. Brainstorm → Plan → TDD → Review. Không bao giờ nhảy thẳng vào code.
---

# /build — Superpowers Development Process

// turbo-all

## PHASE 0: Skill Discovery (BẮT BUỘC — KHÔNG ĐƯỢC SKIP)

1. Đọc lại yêu cầu của user.
2. Tìm trong danh sách skills (trong system prompt) **tất cả** skills liên quan đến task hiện tại.
3. Đọc SKILL.md của **ít nhất 2-3 skills** phù hợp nhất bằng `view_file`.
4. Ghi nhớ các nguyên tắc từ skills đã đọc — áp dụng xuyên suốt.

> ⚠️ NẾU SKIP BƯỚC NÀY = THẤT BẠI. Phải đọc skills trước khi làm bất cứ gì.

---

## PHASE 1: Brainstorming (KHÔNG CODE — CHỈ NÓI CHUYỆN)

Đọc skill: `brainstorming` (`~/.gemini/antigravity/skills/brainstorming/SKILL.md`)

5. **Hỏi user** để làm rõ yêu cầu. Đặt ít nhất 2-3 câu hỏi quan trọng:
   - Mục tiêu thật sự là gì?
   - Có constraint nào không? (tech stack, deadline, style...)
   - Có reference/example nào không?
6. Đề xuất 2-3 hướng tiếp cận khác nhau, phân tích ưu/nhược điểm.
7. Trình bày design **theo từng phần nhỏ** để user duyệt (không dump hết một lúc).
8. **Lưu design document** vào artifact sau khi user approve.
9. Chờ user approve design trước khi tiếp tục.

> ⚠️ KHÔNG viết code trong phase này. Chỉ brainstorm và confirm.

---

## PHASE 2: Git Worktree (TẠO WORKSPACE RIÊNG)

Đọc skill: `using-git-worktrees` (`~/.gemini/antigravity/skills/using-git-worktrees/SKILL.md`)

10. Nếu đang trong git repo → **tạo git worktree** trên branch mới cho task này.
11. Chạy project setup (install dependencies, etc.) trong worktree.
12. Verify test baseline sạch — chạy test suite hiện tại phải pass hết.

> Nếu project không dùng git hoặc user không muốn worktree → skip phase này, ghi chú lý do.

---

## PHASE 3: Planning (TẠO IMPLEMENTATION PLAN)

Đọc skill: `writing-plans` (`~/.gemini/antigravity/skills/writing-plans/SKILL.md`)

13. Chia nhỏ công việc thành các task **2-5 phút mỗi task**.
14. Mỗi task phải có:
    - File path cụ thể cần sửa/tạo
    - Mô tả rõ ràng: thay đổi gì, code gì
    - Test cần viết (RED step)
    - Bước verify: làm sao biết task này xong
15. Viết plan vào `implementation_plan.md` artifact.
16. Trình plan cho user review. **Chờ approval trước khi code.**

---

## PHASE 4: Implementation (SUBAGENT-DRIVEN + TDD)

Đọc skills:
- `test-driven-development` (`~/.gemini/antigravity/skills/test-driven-development/SKILL.md`)
- `subagent-driven-development` (`~/.gemini/antigravity/skills/subagent-driven-development/SKILL.md`)

17. Với mỗi task trong plan, thực hiện theo TDD:
    - **RED**: Viết test TRƯỚC — test phải FAIL
    - **GREEN**: Viết code tối thiểu nhất để test PASS
    - **REFACTOR**: Dọn dẹp code, giữ test pass
    - ❌ **Nếu viết code trước test → XÓA code đó, viết test trước**
18. Sau mỗi task → **tự review 2 giai đoạn**:
    - Stage 1: **Spec compliance** — code có đúng với plan/spec không?
    - Stage 2: **Code quality** — clean code, naming, no duplication?
19. Nếu review fail → fix → review lại trước khi sang task tiếp.
20. Nếu gặp vấn đề không dự kiến → **DỪNG LẠI** → báo user → cập nhật plan.

> Khi có nhiều task độc lập: dùng `dispatching-parallel-agents` để chạy song song.

---

## PHASE 5: Code Review (REVIEW TỔNG THỂ)

Đọc skill: `requesting-code-review` (`~/.gemini/antigravity/skills/requesting-code-review/SKILL.md`)

21. Review toàn bộ code đã viết, phân loại issue theo severity:
    - 🔴 **Critical** — blocks progress, phải fix ngay
    - 🟡 **Warning** — nên fix, ảnh hưởng quality
    - 🟢 **Minor** — nice-to-have, có thể để sau
22. Checklist review:
    - [ ] Code đúng spec/plan?
    - [ ] YAGNI — không có code thừa?
    - [ ] DRY — không có logic trùng lặp?
    - [ ] Error handling đầy đủ?
    - [ ] Naming conventions nhất quán?
    - [ ] Test coverage đủ?
23. Fix tất cả Critical issues trước khi tiếp tục.

---

## PHASE 6: Verification (CHỨNG MINH BẰNG BẰNG CHỨNG)

Đọc skill: `verification-before-completion` (`~/.gemini/antigravity/skills/verification-before-completion/SKILL.md`)

24. Chạy **tất cả** test/build/lint — paste output thật làm bằng chứng.
25. **KHÔNG BAO GIỜ tuyên bố "xong" mà không có output chứng minh.**
26. Nếu có UI → chụp screenshot hoặc mô tả kết quả visual.
27. Tạo `walkthrough.md` artifact tóm tắt:
    - Đã làm gì
    - Test kết quả ra sao
    - Có issue nào còn tồn đọng không

---

## PHASE 7: Finish Branch (KẾT THÚC)

Đọc skill: `finishing-a-development-branch` (`~/.gemini/antigravity/skills/finishing-a-development-branch/SKILL.md`)

28. Verify lần cuối: tất cả test pass.
29. Hỏi user chọn 1 trong 4 options:
    - 🔀 **Merge** — merge worktree branch vào source branch
    - 📝 **PR** — tạo Pull Request trên GitHub
    - 📌 **Keep** — giữ worktree, chưa merge
    - 🗑️ **Discard** — xóa worktree, bỏ thay đổi
30. Thực hiện theo lựa chọn của user.
31. Dọn dẹp worktree nếu cần.
